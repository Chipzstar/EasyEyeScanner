//Main Imports
import React, {Component} from 'react';
import {Root} from "native-base";
import AppContainer from "./app/routes/router";
import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {ActivityIndicator, AsyncStorage} from 'react-native';

//Redux
import {createStore, applyMiddleware} from "redux";
import {Provider} from 'react-redux';
import {persistStore, persistReducer} from 'redux-persist'
import {PersistGate} from "redux-persist/es/integration/react";
import {createLogger} from 'redux-logger';
//reducers
import rootReducer from './store/index';
//Amplify
import Amplify, {Storage} from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig); // Configure Amplify

const persistConfig = {
	key: "root",
	storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = createStore(persistedReducer, applyMiddleware(createLogger()));

const persistedStore = persistStore(reduxStore);

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			fontLoaded: false
		};
		Storage.configure({level: 'private'});
	}

	componentDidMount() {
		Font.loadAsync({
			Roboto_regular: require('./app/assets/fonts/Roboto-Regular.ttf'),
			Roboto_black: require('./app/assets/fonts/Roboto-Black.ttf'),
			Roboto_black_italic: require('./app/assets/fonts/Roboto-BlackItalic.ttf'),
			Roboto_bold: require('./app/assets/fonts/Roboto-Bold.ttf'),
			Roboto_bold_italic: require('./app/assets/fonts/Roboto-BoldItalic.ttf'),
			Roboto_italic: require('./app/assets/fonts/Roboto-Italic.ttf'),
			Roboto_light: require('./app/assets/fonts/Roboto-Light.ttf'),
			Roboto_light_italic: require('./app/assets/fonts/Roboto-LightItalic.ttf'),
			Roboto_medium: require('./app/assets/fonts/Roboto-Medium.ttf'),
			Roboto_thin: require('./app/assets/fonts/Roboto-Thin.ttf'),
			Ionicons: require('native-base/Fonts/Ionicons.ttf')
		}).then(() => this.setState({fontLoaded: true})).catch(err => console.error(err));
	}

	renderLoading = () => {
		return (
			<Root>
				<ActivityIndicator size={"large"}/>
			</Root>
		);
	};

	render() {
		if (!this.state.fontLoaded) {
			return (
				<Root>
					<AppLoading/>
				</Root>
			);
		}
		console.log("fonts loaded");
		return (
			<Provider store={reduxStore}>
				<PersistGate persistor={persistedStore} loading={this.renderLoading()}>
					<Root>
						<AppContainer/>
					</Root>
				</PersistGate>
			</Provider>
		);
	}
}
