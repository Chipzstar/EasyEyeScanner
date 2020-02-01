import React from "react";
import {createAppContainer} from "react-navigation";
import {createDrawerNavigator} from "react-navigation-drawer";
import homeStack from './homeStack';
import AboutScreen from '../screens/AboutScreen/AboutScreen'
import HelpScreen from '../screens/HelpScreen/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';

const screens = {
	Home: {
		screen: homeStack,
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
	initialRouteName: "Home"
};

export const MainStack = createDrawerNavigator(screens, config);

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

const AppContainer = createAppContainer(MainStack);

export default AppContainer;
