import React, {Component} from 'react';
import {ActivityIndicator, BackHandler, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {ImageBrowser} from 'expo-image-picker-multiple';
import * as ImageManipulator from 'expo-image-manipulator';
import {withNavigation} from 'react-navigation';
import {Permissions} from "react-native-unimodules";
import {Body, Button, Container, Header, Icon, Left, Right, Title} from "native-base";
import {connect} from 'react-redux';

import styles from './styles';
import {addPhoto} from "../../../store/actions/capturesAction";

class ImageBrowserComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasCameraRollPermission: null,
			numSelected: 0,
			onSubmit: null
		};
	}

	async componentDidMount() {
		StatusBar.setHidden(true, 'slide');
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
		const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		this.setState({hasCameraRollPermission: status === 'granted'});
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	handleBackButtonPressAndroid = () => {
		this.props.hideImageExplorer();
		return true;
	};

	imagesCallback = (callback) => {
		const {navigation} = this.props;
		callback.then(async (photos) => {
			for (let photo of photos) {
				this.props.addPhoto({
					uri: photo.uri,
					height: photo.height,
					width: photo.width,
				});
			}
			navigation.navigate('ConfirmPDF', {hideCamera: this.props.hideImageExplorer});
		}).catch((e) => console.log(e)).finally(() => navigation.setParams({loading: false}));
	};

	async _processImageAsync(uri) {
		return await ImageManipulator.manipulateAsync(
			uri,
			[{resize: {width: 1000}}],
			{compress: 0.8, format: ImageManipulator.SaveFormat.JPEG}
		);
	}

	updateHandler = (count, onSubmit) => {
		this.setState({
			numSelected: count,
			onSubmit: onSubmit,
		});
	};

	renderSelectedComponent = (number) => (
		<View style={styles.countBadge}>
			<Text style={styles.countBadgeText}>{number}</Text>
		</View>
	);

	render() {
		const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
		const submitButton = (
			<Right>
				<Button transparent onPress={() => this.state.onSubmit()}>
					<Text style={{color: 'white', fontSize: 18, fontWeight: "300"}}>Done</Text>
				</Button>
			</Right>
		);
		return (
			<Container style={styles.container}>
				<Header>
					<Left style={{flex: 1}}>
						<Button
							accessibilityLabel={'Back button'}
							accessibilityHint={'Go back to previous screen'}
							transparent
							onPress={() => this.props.hideImageExplorer()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body>
						<Title>Selected {this.state.numSelected}</Title>
					</Body>
					{this.state.numSelected > 0 ? submitButton : <Right/>}
				</Header>
				<ImageBrowser
					max={4}
					onChange={this.updateHandler}
					callback={this.imagesCallback}
					preloaderComponent={(
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
							<ActivityIndicator size={"large"}/>
						</View>
					)}
					renderSelectedComponent={this.renderSelectedComponent}
					emptyStayComponent={emptyStayComponent}
				/>
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		captures: state.captures.captures
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addPhoto: (photo) => {
			dispatch(addPhoto(photo))
		}
	}
};

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
	mapStateToProps,
	mapDispatchToProps
);

const reduxImageBrowser = connectToStore(ImageBrowserComponent);

export default withNavigation(reduxImageBrowser);
