global.Buffer = global.Buffer || require('buffer').Buffer;

import React, {Component} from 'react';
import {FlatList, Image, View, TouchableOpacity, StyleSheet} from "react-native";
import {addDocument} from "../../../store/actions/documentsAction";
import {clear} from "../../../store/actions/capturesAction";
import shorthash from 'shorthash';
import { FileSystem } from "react-native-unimodules";
import {
	Root,
	Container,
	Content,
	Header,
	Form,
	Item,
	Label,
	Input,
	ListItem,
	CheckBox,
	Separator,
	Body,
	Right,
	Title,
	Text,
	Toast,
	Button,
	Thumbnail, Icon, Left
} from "native-base";
import {connect} from 'react-redux';
import { Storage } from 'aws-amplify';
import axios from 'axios';

class ConfirmPDFScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveToGallery: false,
			success: false,
			access: 'private',
			keys: []
		};
		const customPrefix = {
			public: 'public/',
			protected: 'protected/',
			private: 'uploads/'
		};
		Storage.configure({level: 'private', customPrefix: customPrefix});
	}

	componentDidMount() {
		const day = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		let date = day + '-' + month + '-' + year;
		this.setState({date});
		this.setState({ImageURI: this.props.captures === undefined ? null : String(this.props.captures[0].uri)});
		this.setState({title: `Scan - ${date}`});
	}

	saveDocuments = () => {
		let title = {documentTitle: this.state.title};
		let captures = {captures: this.props.captures};
		let uri = {imageURI: this.state.ImageURI};
		let document = Object.assign(title, uri, captures);
		this.props.addDocument(document);
		this.storeInS3().then(res => {
			this.setState({success: true});
			console.log(this.state.keys);
			this.props.clearPhotos();
			this.props.navigation.navigate('Home', {isCamera: false});
		});
	};

	storeInS3 = async () => {
		await Promise.all(
			this.props.captures.map(async image => {
				FileSystem.getInfoAsync(image.uri).then(res => console.log(res));
				const blob = await new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.onload = function () {
						resolve(xhr.response);
					};
					xhr.onerror = function () {
						reject(new TypeError("Network request failed"));
					};
					xhr.responseType = "blob";
					xhr.open("GET", image.uri, true);
					xhr.send(null);
				});
				let fileName = shorthash.unique(image.uri).concat(".", blob._data.name.split('.').pop());
				console.log(fileName);
				const options = {
					level: this.state.access,
					contentType: blob._data.type,
					progressCallback(progress) {
						console.log(`Uploaded: ${Math.trunc((progress.loaded / progress.total) * 100)}%`);
					},
				};
				try {
					const result = await Storage.put(`${this.state.title}/${fileName}`, blob, options);
					console.log("IMAGE UPLOADED TO AWS S3:", result);
					this.setState({keys: [...this.state.keys, result.key]});
				} catch (err) {
					throw err;
				}
			}));
	};

	render() {
		let {saveToGallery} = this.state;
		return (
			<Root>
				<Container>
					<Header>
						<Left style={{flex: 1}}>
							<Button transparent onPress={() => this.props.navigation.goBack()}>
								<Icon name="arrow-back"/>
							</Button>
						</Left>
						<Body>
							<Title>Review PDF</Title>
						</Body>
						<Right/>
					</Header>
					<Content contentContainerStyle={{flexGrow: 1}}>
						<Form>
							<Item>
								<Label style={{fontWeight: 'bold'}}>Name of PDF</Label>
								<Input
									placeholder={`Scan - ${this.state.date}`}
									onChangeText={(text) => this.setState({title: text})}
									maxLength={20}
									value={this.state.title}/>
							</Item>
						</Form>
						<Separator bordered>
							<Text style={styles.subtitle}>Images</Text>
						</Separator>
						<ListItem>
							<FlatList
								keyExtractor={(item) => this.props.captures.indexOf(item).toString()}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								data={this.props.captures}
								renderItem={({item}) => (
									<TouchableOpacity style={styles.thumbnail}
									                  onPress={() => this.setState({uri: item.uri})}>
										<Thumbnail square large source={{uri: item.uri}}/>
									</TouchableOpacity>
								)}
							/>
						</ListItem>
						<Separator bordered>
							<Text style={styles.subtitle}>Preview</Text>
						</Separator>
						<ListItem style={{
							flex: 1,
							alignItems: 'center',
							alignSelf: 'center'
						}}>
							{this.state.uri &&
							<Image source={{uri: this.state.uri}} style={{width: 250, height: 250}}/>}
						</ListItem>
						<Separator bordered>
							<Text style={styles.subtitle}>Options</Text>
						</Separator>
						<ListItem>
							<CheckBox checked={saveToGallery}
							          onPress={() => this.setState({saveToGallery: !saveToGallery})}/>
							<Body>
								<Text>Save PDF to Gallery</Text>
							</Body>
						</ListItem>
						<View style={styles.bottom}>
							<Button large info onPress={() => {
								this.saveDocuments();
								Toast.show({
									text: "Document saved successfully!",
									textStyle: {color: "yellow", fontSize: 18},
									position: 'bottom',
									buttonText: "Okay",
									duration: 5
								});
							}}>
								<Text style={{textAlign: 'center'}}>Save!</Text>
							</Button>
						</View>
					</Content>
				</Container>
			</Root>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		captures: state.captures.captures,
		documents: state.documents.documents
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDocument: (document) => {
			dispatch(addDocument(document))
		},
		clearPhotos: () => {
			dispatch(clear())
		}
	}
};

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
	mapStateToProps,
	mapDispatchToProps
);

const ConnectedComponent = connectToStore(ConfirmPDFScreen);

export default ConnectedComponent;

const styles = StyleSheet.create({
	thumbnail: {
		paddingHorizontal: 5
	},
	bottom: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingVertical: 25
	},
	subtitle: {
		fontSize: 18
	}
});
