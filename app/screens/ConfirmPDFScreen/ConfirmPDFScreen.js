import React, {Component} from 'react';
import {FlatList, Image, View, TouchableOpacity, StyleSheet} from "react-native";
import {addDocument, updateDocument} from "../../../store/actions/documentsAction";
import {clearPhotos} from "../../../store/actions/capturesAction";
import shorthash from 'shorthash';
import {FileSystem} from "react-native-unimodules";
import {Storage} from 'aws-amplify';
import {
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
	Button,
	Thumbnail, Icon, Left
} from "native-base";
import {connect} from 'react-redux';

//functions
import GeneratePDF from "../../functions/generatePDF";
import Loader from "../../components/Loader";

class ConfirmPDFScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			saveToGallery: false,
			success: false,
			access: 'private',
			keys: []
		};
	}

	componentDidMount() {
		const day = ("0" + new Date().getDate()).slice(-2);
		const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
		const year = new Date().getFullYear();
		const hours = ("0" + new Date().getHours()).slice(-2);
		const minutes = ("0" + new Date().getMinutes()).slice(-2);
		const seconds = ("0" + new Date().getSeconds()).slice(-2);
		let date = day + '-' + month + '-' + year;
		let time = hours + ':' + minutes + ':' + seconds;
		console.log(new Date().toTimeString());
		this.setState({date, time});
		this.setState({ImageURI: this.props.captures === undefined ? null : String(this.props.captures[0].uri)});
		this.setState({title: `${date}/${time}`});
	}

	saveDocuments = () => {
		this.setState({loading: true});
		let date = {createdAt: this.state.date.split("-").join("/")};
		let title = {documentTitle: this.state.title};
		let captures = {captures: this.props.captures};
		let uri = {imageURI: this.state.ImageURI};
		let state = {status: "PENDING"};
		let document = Object.assign(title, date, uri, captures, state);
		this.props.addDocument(document);
		this.storeInS3().then(() => {
			this.setState({success: true});
			console.log(this.state.keys);
			GeneratePDF(this.state.title).then((res) => {
				console.log(res);
				this.setState({loading: false});
				let newDocument = {...document, ...res, status: "COMPLETE"};
				console.log("NEW DOCUMENT", newDocument);
				this.props.updateDocument(this.state.ImageURI, newDocument);
				this.props.clearPhotos();
				this.props.navigation.state.params.hideCamera();
				this.props.navigation.pop();
			});
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
		let { navigation } = this.props;
		let {loading, saveToGallery} = this.state;
		return (
			<Container>
				<Loader	loading={loading} />
				<Header>
					<Left style={{flex: 1}}>
						<Button
							accessibilityLabel={'Back button'}
							accessibilityHint={'Go back to previous screen'}
							transparent
							onPress={() => navigation.goBack()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body>
						<Title accessibilityLabel={"Review PDF"} accessibilityRole={"header"}>
							Review PDF
						</Title>
					</Body>
					<Right/>
				</Header>
				<Content contentContainerStyle={{flexGrow: 1}}>
					<Form>
						<Item>
							<Label style={{fontWeight: 'bold'}}>Name of PDF</Label>
							<Input
								accessibilityLabel={'Name of Document'}
								accessibilityHint={'Input field for naming the image collection'}
								placeholder={`Scan${this.state.date}`}
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
							accessibilityLabel={"captured photos"}
							accessibilityHint={"horizontal scroll view of all selected photos"}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={this.props.captures}
							renderItem={({item}) => (
								<TouchableOpacity
									style={styles.thumbnail}
									onPress={() => this.setState({uri: item.uri})}
									accessibilityLabel={'captured image'}
									accessibilityHint={'a snapshot of a captured image'}
									accessibilityRole={"imagebutton"}
								>
									<Thumbnail square large source={{uri: item.uri}}/>
								</TouchableOpacity>
							)}
						/>
					</ListItem>
					<Separator bordered>
						<Text style={styles.subtitle}>Preview</Text>
					</Separator>
					<ListItem
						accessibilityLabel={"Image Preview"}
						style={{
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
						<CheckBox
							checked={saveToGallery}
							onPress={() => this.setState({saveToGallery: !saveToGallery})}/>
						<Body>
							<Text>Save PDF to Gallery</Text>
						</Body>
					</ListItem>
					<View style={styles.bottom}>
						<Button
							accessibilityLabel={"Save Document"}
							accessibilityHint={"Saves all captured images into one PDF document"}
							large info
							onPress={() => this.saveDocuments()}>
							<Text style={{textAlign: 'center'}}>Save!</Text>
						</Button>
					</View>
				</Content>
			</Container>
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
		updateDocument: (imageURI, newDocument) => {
			dispatch(updateDocument(imageURI, newDocument))
		},
		clearPhotos: () => {
			dispatch(clearPhotos())
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
