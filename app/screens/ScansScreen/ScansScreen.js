import React, {Component} from 'react';
import {Container, Header, Button, Body, Title, Left, Right, Icon, Content, Fab} from "native-base";
import {FlatList, View} from "react-native";
import {Constants, Permissions} from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

//images
import card_image_1 from "../../assets/images/card-image.png";
import card_image_2 from "../../assets/images/card-image-2.png";
import card_image_3 from "../../assets/images/card-image-3.png";

//styles
import styles from "./styles";

//components
import DocumentScanCard from '../../components/CardComponent';
import CameraComponent from "../../components/Camera/CameraComponent";

class ScansScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uri: "",
			active: false,
			documents: [
				{title: "Document 1", imageURI: card_image_1},
				{title: "Document 2", imageURI: card_image_2},
				{title: "Document 3", imageURI: card_image_3},
			],
			isCamera: false
		};
	}

	componentDidMount() {
		this.getPermissionAsync().then(res => console.log('Permission granted!'));
		const date = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		this.setState({date: date + '/' + month + '/' + year});//Current Year
	}

	getPermissionAsync = async () => {
		if (Constants.platform.android) {
			const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	takePicture() {
		this.setState({isCamera: true});
	}

	selectPicture = async () => {
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		};
		let result = await ImagePicker.launchImageLibraryAsync(options);

		if (!result.cancelled) {
			this.setState({uri: result.uri});
		}
	};

	goHome = () => {
		this.setState({isCamera: false})
	};

	render() {
		const {navigation} = this.props;
		let {documents} = this.state;
		let {isCamera} = this.state;
		if (isCamera) {
			return <CameraComponent hideCamera={this.goHome.bind(this)}/>
		} else {
			return (
				<Container style={{marginTop : 25}}>
					<Header iosBarStyle={"dark-content"}>
						<Left>
							<Button
								transparent
								onPress={() => navigation.openDrawer()}
							>
								<Icon name='menu'/>
							</Button>
						</Left>
						<Body>
							<Title>My Scans</Title>
						</Body>
						<Right>
							<Button transparent>
								<Icon name='more'/>
							</Button>
						</Right>
					</Header>

					<Content padder
					         style={{flex: 1}}
					         contentContainerStyle={{flex: 1}} // important!
					>
						<FlatList
							data={this.state.documents}
							renderItem={({item}) => (
								<DocumentScanCard name={item.title} date={this.state.date} image={item.imageURI}/>
							)}
							keyExtractor={(item) => documents.indexOf(item).toString()}
							showsVerticalScrollIndicator={false}
						>
						</FlatList>
					</Content>
					<Fab
						active={this.state.active}
						direction="up"
						containerStyle={{}}
						style={{backgroundColor: '#5067FF'}}
						position="bottomRight"
						onPress={() => this.setState({active: !this.state.active})}>
						<Icon name="add"/>
						<Button
							style={{backgroundColor: '#3673a3'}}
							onPress={() => this.takePicture()}
						>
							<Icon name="camera"/>
						</Button>
						<Button
							style={{backgroundColor: '#3673a3'}}
							onPress={() => this.selectPicture()}
						>
							<Icon name="image"/>
						</Button>
					</Fab>
				</Container>
			)
		}
	}
}

export default ScansScreen;
