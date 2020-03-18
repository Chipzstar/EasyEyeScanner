import React, {Component} from 'react';
import {Container, Header, Button, Body, Title, Left, Right, Icon, Content, Fab} from "native-base";
import {AsyncStorage, FlatList, StatusBar, Text} from "react-native";
import {Constants, Permissions} from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';
import {connect} from 'react-redux';
import {YellowBox} from 'react-native'

//components
import DocumentScanCard from '../../components/CardComponent';
import CameraComponent from "../../components/Camera/CameraComponent";
import ImageBrowserComponent from "../../components/ImageGallery/ImageBrowserComponent";

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uri: "",
			active: false,
			isCamera: false,
			isImageGallery: false
		};
	}

	componentDidMount() {
		StatusBar.setHidden(true, 'slide');
		this.getPermissionAsync().then(() => console.log('Permission granted!'));
		const date = new Date().getDate(); //Current Day
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear(); //Current Year
		this.setState({date: date + '/' + month + '/' + year});
		this._retrieveData().then(res => console.log(res));//Current Date
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
		this.setState({isImageGallery: true});
	};

	goHome = () => {
		this.setState({isCamera: false, isImageGallery: false})
	};

	_retrieveData = async () => {
		try {
			return JSON.parse(await AsyncStorage.getItem("persist:root"));
		} catch (err) {
			throw err;
		}
	};

	render() {
		const {navigation} = this.props;
		let {isCamera, isImageGallery} = this.state;
		let {documents} = this.props;
		if (isCamera) {
			return <CameraComponent hideCamera={this.goHome.bind(this)}/>
		} else if (isImageGallery) {
			return <ImageBrowserComponent hideImageExplorer={this.goHome.bind(this)}/>
		} else {
			return (
				<Container>
					<Header iosBarStyle={"dark-content"}>
						<Left>
							<Button
								transparent
								onPress={() => navigation.openDrawer()}
								accessibilityLabel={"Side Menu"}
								accessibilityHint={"Opens the side menu drawer"}
								accessibilityRole={"button"}
							>
								<Icon name='menu'/>
							</Button>
						</Left>
						<Body>
							<Title>My Scans</Title>
						</Body>
						<Right>
							<Button
								transparent
								accessibilityLabel={"Options"}
								accessibilityHint={"Click to see more options"}
							>
								<Icon name='more'/>
							</Button>
						</Right>
					</Header>

					<Content
						padder
						style={{flex: 1}}
						contentContainerStyle={{flex: 1}}
						scrollEnabled={false}
					>
						<FlatList
							data={documents}
							renderItem={({item}) => (
								<DocumentScanCard
									name={item.documentTitle}
									date={this.state.date}
									image={item.imageURI}/>
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
						onPress={() => this.setState({active: !this.state.active})}
					>
						<Icon name="add"/>
						<Button
							style={{backgroundColor: '#3673a3'}}
							onPress={() => this.takePicture()}
							accessibilityLabel={"Camera"}
							accessibilityHint={"Fab button to start taking photos with camera"}
						>
							<Icon name="camera"/>
						</Button>
						<Button
							style={{backgroundColor: '#3673a3'}}
							onPress={() => this.selectPicture()}
							accessibilityLabel={"Image Gallery"}
							accessibilityHint={"Fab button to open your image gallery"}
						>
							<Icon name="image"/>
						</Button>
					</Fab>
				</Container>
			)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		documents: state.documents.documents
	}
};

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
	mapStateToProps
);

const reduxHomeScreen = connectToStore(HomeScreen);

export default reduxHomeScreen;
