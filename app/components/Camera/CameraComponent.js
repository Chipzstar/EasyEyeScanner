import React, {Component} from 'react';
import {Text, View, StatusBar, Button, Alert, BackHandler} from 'react-native';
import {Camera} from 'expo-camera';
import {Permissions} from 'react-native-unimodules';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import {addPhoto} from "../../../store/actions/capturesAction";

//icons and components
import CameraToolbar from './CameraToolbar';
import Gallery from './GalleryComponent';

import styles from "./styles";

class CameraComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			capturing: null,
			hasCameraPermission: null,
			cameraType: Camera.Constants.Type.back,
			flashMode: Camera.Constants.FlashMode.off
		};
	}

	setFlashMode = (flashMode) => this.setState({flashMode});
	setCameraType = (cameraType) => this.setState({cameraType});

	snap = async () => {
		this.setState({capturing: true});
		if (this.camera) {
			console.log('Taking photo');
			const options = {quality: 1, base64: false, fixOrientation: true};
			let photoData = await this.camera.takePictureAsync(options);
			this.props.addPhoto(photoData);
			this.setState({capturing: false});
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
		Alert.alert('Warning', 'Please take a picture before attempting to Save PDF!')
	};

	render() {
		const {hasCameraPermission, cameraType, flashMode, capturing} = this.state;
		let numImages = this.props.captures.length;
		console.log("Photos taken: ", numImages);
		const activeButton = (
			<Button style={styles.topToolbar} onPress={() => this.props.navigation.navigate('ConfirmPDF', {hideCamera: this.props.hideCamera})}
			        title={'Save PDF'}
			        accessibilityLabel={'SAVE AS PDF'}/>
		);
		const disabledButton = (
			<Button disabled onPress={() => this.showAlert()} title={'Save PDF'}
			        accessibilityLabel={'This button is temporarily disabled!'}/>
		);
		if (hasCameraPermission === null) {
			return <View/>
		} else if (!hasCameraPermission) {
			return <Text>Access to camera has been denied.</Text>
		} else {
			return (
				<React.Fragment>
					{numImages > 0 ? activeButton : disabledButton}
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

					{numImages > 0 && <Gallery navigation={this.props.navigation}/>}

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
// and that function returns the connected, wrapper component:
const reduxCameraComponent = connectToStore(CameraComponent);

// We normally do both in one step, like this:
/*connect(
	mapStateToProps,
	mapDispatchToProps
)(Component);*/

export default withNavigation(reduxCameraComponent);
