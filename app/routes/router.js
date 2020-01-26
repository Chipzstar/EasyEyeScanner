import React from "react";
import {createAppContainer} from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import scansStack from './scansStack';
import AboutScreen from '../screens/AboutScreen/AboutScreen'
import HelpScreen from '../screens/HelpScreen/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';

const screens = {
	Scans: {
		screen: scansStack,
	},
	About: {
		screen: AboutScreen,
		navigationOptions: {
			title: "About"
		}
	},
	Help: {
		screen: HelpScreen,
		navigationOptions: {
			title: "Help"
		}
	},
	Preferences: {
		screen: SettingsScreen,
		navigationOptions: {
			title: "Preferences"
		}
	}
};

const config = {
	initialRouteName: "Scans"
};

export const HomeStack = createDrawerNavigator(screens, config);

/*export const RootNavigator = createSwitchNavigator(
	{
		AuthLoading: AuthLoadingScreen,
		App: SignedIn,
		Auth: SignedOut
	},
	{
		initialRouteName: "AuthLoading"
	}
);*/

const AppContainer = createAppContainer(HomeStack);

export default AppContainer;
