import React from "react";
import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from '../screens/HomeScreen/HomeScreen';

const screens = {
	Home: {
		screen: HomeScreen,
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
