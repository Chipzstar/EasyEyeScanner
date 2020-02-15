import React, {Component} from 'react';
import {Container, Header, Button, Body, Title, Left, Right, Icon, Content, Fab} from "native-base";
import {FlatList, StatusBar, Text} from "react-native";
import {Constants, Permissions} from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';
import {connect} from 'react-redux';
import {YellowBox} from 'react-native'

//components
import DocumentScanCard from '../../components/CardComponent';
import CameraComponent from "../../components/Camera/CameraComponent";

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);

//functions
import TextIdentification from "../../functions/textExtraction";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uri: "",
			active: false,
			isCamera: false,
		};
	}

	componentDidMount() {
		StatusBar.setHidden(true, 'slide');
		this.getPermissionAsync().then(res => console.log('Permission granted!', res));
		const date = new Date().getDate(); //Current Day
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear(); //Current Year
		this.setState({date: date + '/' + month + '/' + year}); //Current Date
		this.setState({isCamera: this.props.navigation.state.params == null ? false : this.props.navigation.getParam('isCamera')});
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
			allowsEditing: false,
			aspect: [16, 9],
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
		console.log(this.props.navigation.getParam('isCamera'));
		const {navigation} = this.props;
		let documents = this.props.documents;
		let {isCamera} = this.state;
		if (isCamera) {
			return <CameraComponent hideCamera={this.goHome.bind(this)}/>
		} else {
			return (
				<Container>
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

					<Content padder style={{flex: 1}} contentContainerStyle={{flex: 1}} scrollEnabled={false}>
						<Button large success style={{alignSelf: 'center', paddingHorizontal: 20}}
						        onPress={() => TextIdentification()}>
							<Text style={{fontSize: 24, textAlign: 'center'}}>Identify</Text>
						</Button>
						<FlatList
							data={documents}
							renderItem={({item}) => (
								<DocumentScanCard name={item.documentTitle} date={this.state.date}
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
