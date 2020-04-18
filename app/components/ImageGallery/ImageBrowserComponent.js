import React, {Component} from 'react';
import {ActivityIndicator, BackHandler, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {ImageBrowser} from 'expo-image-picker-multiple';
import {withNavigation} from 'react-navigation';
import { Permissions } from "react-native-unimodules";
import {Body, Button, Container, Header, Icon, Left, Right, Title} from "native-base";
import {connect} from 'react-redux';

import styles from './styles';
import {addPhoto} from "../../../store/actions/capturesAction";
import Loader from "../Loader";

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
		/*FileSystem.downloadAsync(
          'https://i.stack.imgur.com/ZS6nH.png',
          FileSystem.documentDirectory + 'image_5.jpg'
        )
          .then(({uri}) => {
            console.log('Finished downloading to ', uri);
            MediaLibrary.saveToLibraryAsync(uri)
            .then(() => {
                console.log("file saved to media library");
                //MediaLibrary.getAssetsAsync( {mediaType: 'photo'}).then(res => console.log(res));
            })
            .catch(err => console.error(err));
          })
          .catch(error => console.error(error));*/
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
		const {navigation } = this.props;
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
		const emptyStayComponent = <Text style={styles.emptyStay}>No images found in camera roll!</Text>;
		const submitButton = (
			<Right>
				<Button
					accessibilityLabel={"Done"}
					accessibilityHint={"Press to confirm the select selected images to use in document"}
					accessibilityRole={'button'}
					transparent onPress={() => this.state.onSubmit()}>
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
					max={10}
					onChange={this.updateHandler}
					callback={this.imagesCallback}
					preloaderComponent={(
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
							<Loader loading={true}/>
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
