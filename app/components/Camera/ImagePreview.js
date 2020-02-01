import React, {Component} from 'react';
import {Image, Text} from 'react-native';
import {Container, Content, Header, Title, Left, Body, Icon, Right, Footer, FooterTab, Button} from 'native-base'
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {connect} from 'react-redux';
import {removePhoto} from "../../../store/actions/capturesAction";

class ImagePreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accept: true,
			discard: false
		};
	}

	deletePhoto = (uri) => {
		this.props.removePhoto(uri);
		this.props.navigation.goBack();
	};

	render() {
		const photoData = Object.assign(this.props.navigation.state.params);
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
				<Content>
					<Image source={{uri: photoData.uri}}
					       style={{flex: 1, justifyContent: 'center', alignItems: 'center', aspectRatio: 0.5}}
					       resizeMode="contain"/>
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical>
							<MaterialCommunityIcons name={"file-replace"} size={28} color={'white'}/>
							<Text style={styles.iconText}>Replace</Text>
						</Button>
						<Button vertical>
							<MaterialIcons name={'rotate-right'} size={28} color={'white'}/>
							<Text style={styles.iconText}>Rotate</Text>
						</Button>
						<Button vertical active>
							<Icon name="crop"/>
							<Text style={styles.iconText}>Crop</Text>
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
		}
	}
};

const connectToStore = connect(
	mapStateToProps,
	mapDispatchToProps
);

const ConnectedComponent = connectToStore(ImagePreview);

export default ConnectedComponent;
