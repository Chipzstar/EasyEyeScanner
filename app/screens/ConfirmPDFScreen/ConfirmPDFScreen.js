import React, {Component} from 'react';
import {FlatList, Image, View, TouchableOpacity, StyleSheet} from "react-native";
import {addDocument} from "../../../store/actions/documentsAction";
import {clear} from "../../../store/actions/capturesAction";
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

class ConfirmPDFScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveToGallery: false,
			success: false,
		};
	}

	componentDidMount() {
		const day = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		let date = day + '/' + month + '/' + year;
		this.setState({date});
		this.setState({uri: String(this.props.captures[0].uri)});
		this.setState({title: `Scan - ${date}`});
	}

	saveDocuments = () => {
		let title = {documentTitle: this.state.title};
		let captures = {captures: this.props.captures};
		let uri = {imageURI: this.state.uri};
		let document = Object.assign(title, uri, captures);
		console.log(document);
		this.props.addDocument(document);
		this.setState({success: true});
		this.props.clearPhotos();
		this.props.navigation.push('Home');
	};

	render() {
		let {saveToGallery} = this.state;
		const errorToast = () => Toast.show({
			text: "Error!",
			textStyle: {color: "red", fontSize: 18},
			position: 'bottom',
			buttonText: "Okay",
			duration: 5
		});
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
									maxLength={15}
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
								Toast.show({
									text: "Document saved successfully!",
									textStyle: {color: "yellow", fontSize: 18},
									position: 'bottom',
									buttonText: "Okay",
									duration: 5
								});
								this.saveDocuments();
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
