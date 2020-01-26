import React from "react";
import {createStackNavigator} from "react-navigation-stack";
import ScansScreen from '../screens/ScansScreen/ScansScreen';

const screens = {
	Home: {
		screen: ScansScreen,
	}
};

const config = {
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	}
};

const ScansStack = createStackNavigator(screens, config);

export default ScansStack;
