import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native';
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {Constants, Permissions} from 'react-native-unimodules';
import {Container, Content, Header, Item, Icon, Input, Button} from "native-base";
import {FontAwesome, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';

const { WIDTH, HEIGHT } = Dimensions.get('window');

export default class CameraComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null,
			cameraType: Camera.Constants.Type.back,
			flashMode: Camera.Constants.FlashMode.off
		};
	}

	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}

	snap = async () => {
		if (this.camera) {
			console.log('Taking photo');
			const options = {quality: 1, base64: false, fixOrientation: true, onPictureSaved: this.onPictureSaved};
			await this.camera.takePictureAsync(options);
		}
	};

	pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
	};

	onPictureSaved = photo => {
		console.log(photo);
		this.camera = false;
	};

	setFlashMode = (flashMode) => this.setState({ flashMode });

	handleCameraType = () => {
		const {cameraType} = this.state;
		this.setState({
			cameraType:
				cameraType === Camera.Constants.Type.back
					? Camera.Constants.Type.front
					: Camera.Constants.Type.back
		})
	};

	render() {
		const { hasCameraPermission, cameraType, flashMode } = this.state;
		if (hasCameraPermission === null) {
			return <View/>
		} else if (!hasCameraPermission) {
			return <Text>Access to camera has been denied.</Text>
		} else {
			return (
				<View style={{flex: 1}}>
					<Camera style={styles.preview} type={cameraType} flashMode={flashMode} ref={(ref) => {
						this.camera = ref
					}}>
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
							<TouchableOpacity style={{
								alignSelf: 'flex-start',
								alignItems: 'center',
								backgroundColor: 'transparent',
								paddingLeft: 20,
								paddingTop: 20
								}} onPress={() => this.props.hideCamera()}
							>
								<Ionicons
									name={'md-home'}
									style={{color: "white", fontSize: 40}}
								/>
							</TouchableOpacity>
							<TouchableOpacity style={{
								alignSelf: 'flex-start',
								alignItems: 'center',
								backgroundColor: 'transparent',
								paddingRight: 20,
								paddingTop: 20
								}} onPress={() => this.setFlashMode(flashMode === Camera.Constants.FlashMode.on ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.on)}
							>
								<Ionicons
									name={flashMode === Camera.Constants.FlashMode.on ? "md-flash" : 'md-flash-off'}
									style={{color: "white", fontSize: 40}}
								/>
							</TouchableOpacity>
						</View>
						<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20}}>
							<TouchableOpacity
								style={styles.bottomCameraIcon}
								onPress={() => this.pickImage()}
							>
								<Ionicons
									name={"md-photos"}
									style={{color: "white", fontSize: 40}}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.bottomCameraIcon}
								onPress={() => this.snap()}
							>
								<MaterialCommunityIcons
									name={"circle-outline"}
									style={{color: "white", fontSize: 100}}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.bottomCameraIcon}
								onPress={() => this.handleCameraType()}
							>
								<Ionicons
									name={"md-reverse-camera"}
									style={{color: "white", fontSize: 40}}
								/>
							</TouchableOpacity>
						</View>
					</Camera>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	preview: {
		height: HEIGHT,
		width: WIDTH,
		flex: 1,
		//position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},
	bottomCameraIcon: {
		alignSelf: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
	}
});
