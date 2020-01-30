import React, {Component} from 'react';
import {Text, View, StatusBar, Button, Alert, BackHandler} from 'react-native';
import {Camera} from 'expo-camera';
import {Permissions} from 'react-native-unimodules';
import {withNavigation} from 'react-navigation';

//icons and components
import CameraToolbar from './CameraToolbar';
import Gallery from './GalleryComponent';

import styles from "./styles";

class CameraComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			captures: [],
			capturing: null,
			hasCameraPermission: null,
			cameraType: Camera.Constants.Type.back,
			flashMode: Camera.Constants.FlashMode.off
		};
	}

	setFlashMode = (flashMode) => this.setState({flashMode});
	setCameraType = (cameraType) => this.setState({cameraType});

	snap = async () => {
		if (this.camera) {
			console.log('Taking photo');
			const options = {quality: 1, base64: false, fixOrientation: true};
			let photoData = await this.camera.takePictureAsync(options);
			this.setState({capturing: false, captures: [photoData, ...this.state.captures]});
			console.log(photoData);
		}
	};

	async componentDidMount() {
		StatusBar.setHidden(true, 'slide');
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	handleBackButtonPressAndroid = () => {
		if (!this.props.navigation.isFocused()) {
			// The screen is not focused, so don't do anything
			return false;
		}
		this.props.hideCamera();
		return true;
	};

	showAlert = () => {
		Alert.alert('Please take a picture before attempting to Save PDF!')
	};

	render() {
		const {hasCameraPermission, cameraType, flashMode, captures, capturing} = this.state;
		const activeButton = (
			<Button style={styles.topToolbar} onPress={() => this.props.navigation.navigate('ConfirmPDF')} title={'Save PDF'}
			        accessibilityLabel={'SAVE AS PDF'}/>
		);
		const disabledButton = (
			<Button onPress={() => this.showAlert()} title={'Save PDF'} disabled/>
		);
		if (hasCameraPermission === null) {
			return <View/>
		} else if (!hasCameraPermission) {
			return <Text>Access to camera has been denied.</Text>
		} else {
			return (
				<React.Fragment>
					{captures.length > 0 ? activeButton : disabledButton}
					<View>
						<Camera
							style={styles.preview}
							type={cameraType}
							flashMode={flashMode}
							ratio={'16:9'}
							ref={(ref) => {
								this.camera = ref
							}}
						/>
					</View>

					{captures.length > 0 && <Gallery captures={captures} navigation={this.props.navigation}/>}

					<CameraToolbar
						capturing={capturing}
						flashMode={flashMode}
						cameraType={cameraType}
						setFlashMode={this.setFlashMode}
						setCameraType={this.setCameraType}
						onCapture={this.snap}/>
				</React.Fragment>
			)
		}
	}
}

export default withNavigation(CameraComponent);
