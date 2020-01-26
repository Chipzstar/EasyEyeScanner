import React from "react";
import { createStackNavigator} from "react-navigation-stack";
import AboutScreen from '../screens/AboutScreen/AboutScreen';
import Header from "../components/Header";

const screens = {
	About: {
		screen: AboutScreen,
		navigationOptions: ({ navigation }) => {
			return {
				header: () => <Header title='AboutScreen Easy Eye Scanner' hasBackButton={false} navigation={navigation} />
			}
		}
	}
};

const config = {
	defaultNavigationOptions: {
		headerTintColor: '#444',
		headerStyle: { backgroundColor: '#868686', height: 100},
		headerTitleStyle: { fontWeight: 'bold' }
	}
};

const ScansStack = createStackNavigator(screens, config);

export default ScansStack;
