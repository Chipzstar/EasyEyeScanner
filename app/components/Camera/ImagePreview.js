import React, {Component} from 'react';
import {Image, Text} from 'react-native';
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, Right, Title} from 'native-base'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {connect} from 'react-redux';
import {removePhoto, replacePhoto} from "../../../store/actions/capturesAction";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

class ImagePreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			photoData: Object.assign(this.props.navigation.state.params)
		};
	}

	deletePhoto = (uri) => {
		this.props.removePhoto(uri);
		this.props.navigation.goBack();
	};

	replacePhoto = async (uri) => {
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 1
		};
		let photo = await ImagePicker.launchImageLibraryAsync(options);

		if (!photo.cancelled) {
			this.props.replacePhoto(uri, photo);
			this.props.navigation.goBack();
		}
	};

	rotate90 = async (uri) => {
		let result = await ImageManipulator.manipulateAsync(
			uri,
			[{rotate: 90}],
			{compress: 1, format: ImageManipulator.SaveFormat.PNG}
		);
		console.log(result);
		this.props.replacePhoto(uri, result);
		this.setState({photoData: result});
	};

	flipPhoto = async (uri, width, height) => {
		let result = await ImageManipulator.manipulateAsync(
			uri,
			[{flip: height > width ? ImageManipulator.FlipType.Horizontal : ImageManipulator.FlipType.Vertical}],
			{compress: 1, format: ImageManipulator.SaveFormat.PNG}
		);
		console.log('Flipped photo:', result);
		this.props.replacePhoto(uri, result);
		this.setState({photoData: result});
	};

	render() {
		let {photoData} = this.state;
		let key = this.props.captures.findIndex(photo => photo.uri === photoData.uri) + 1;
		console.log("key: ", key);
		//const ratio = photoData.height / photoData.width;
		return (
			<Container>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body style={{flex: 1}}>
						<Title>Document {key}</Title>
					</Body>
					<Right/>
					{/*<Button transparent>
						<Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Confirm</Text>
					</Button>*/}
				</Header>
				<Content scrollEnabled>
					<Image source={{uri: photoData.uri}}
					       style={{flex: 1, justifyContent: 'center', alignItems: 'center', aspectRatio: 0.5}}
					       resizeMode="contain"/>
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical onPress={() => this.replacePhoto(photoData.uri)}>
							<MaterialCommunityIcons name={"file-replace"} size={28} color={'white'}/>
							<Text style={styles.iconText}>Replace</Text>
						</Button>
						<Button vertical onPress={() => this.rotate90(photoData.uri)}>
							<MaterialIcons name={'rotate-right'} size={28} color={'white'}/>
							<Text style={styles.iconText}>Rotate</Text>
						</Button>
						<Button vertical
						        onPress={() => this.flipPhoto(photoData.uri, photoData.width, photoData.height)}>
							<MaterialIcons name={"flip"} color={'white'} size={28}/>
							<Text style={styles.iconText}>Flip</Text>
						</Button>
						<Button vertical onPress={() => this.deletePhoto(photoData.uri)}>
							<MaterialIcons name={'delete'} size={28} color={'white'}/>
							<Text style={styles.iconText}>Delete</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		captures: state.captures.captures
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		removePhoto: (uri) => {
			dispatch(removePhoto(uri))
		},
		replacePhoto: (oldURI, newPhoto) => {
			dispatch(replacePhoto(oldURI, newPhoto))
		}
	}
};

const connectToStore = connect(
	mapStateToProps,
	mapDispatchToProps
);

const ConnectedComponent = connectToStore(ImagePreview);

export default ConnectedComponent;
