import React from "react";
import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ImagePreview from "../components/Camera/ImagePreview";
import confirmPDFScreen from '../screens/ConfirmPDFScreen/ConfirmPDFScreen'

const screens = {
	Home: {
		screen: HomeScreen,
	},
	ImagePreview: {
		screen: ImagePreview
	},
	ConfirmPDF: {
		screen: confirmPDFScreen
	}
};

const config = {
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	}
};

const HomeStack = createStackNavigator(screens, config);

export default HomeStack;
