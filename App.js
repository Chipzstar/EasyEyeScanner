import React, {Component} from 'react';
import {Root} from "native-base";
import AppContainer from "./app/routes/router";
import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import Predictions from '@aws-amplify/predictions'
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import {createStore, combineReducers} from "redux";
import {Provider} from 'react-redux'
import capturesReducer from './store/reducers/capturesReducer'
import documentsReducer from './store/reducers/documentsReducer'

Amplify.configure(awsconfig);        // Configure Amplify
Predictions.configure(awsconfig);

const rootReducer = combineReducers({
	captures: capturesReducer,
	documents: documentsReducer
});

const reduxStore = createStore(rootReducer);

export default class App extends Component {

	constructor() {
		super();
		this.state = {
			fontLoaded: false
		}
	}

	async componentDidMount() {
		await Font.loadAsync({
			'Roboto_regular': require('./app/assets/fonts/Roboto-Regular.ttf'),
			'Roboto_black': require('./app/assets/fonts/Roboto-Black.ttf'),
			'Roboto_black_italic': require('./app/assets/fonts/Roboto-BlackItalic.ttf'),
			'Roboto_bold': require('./app/assets/fonts/Roboto-Bold.ttf'),
			'Roboto_bold_italic': require('./app/assets/fonts/Roboto-BoldItalic.ttf'),
			'Roboto_italic': require('./app/assets/fonts/Roboto-Italic.ttf'),
			'Roboto_light': require('./app/assets/fonts/Roboto-Light.ttf'),
			'Roboto_light_italic': require('./app/assets/fonts/Roboto-LightItalic.ttf'),
			'Roboto_medium': require('./app/assets/fonts/Roboto-Medium.ttf'),
			'Roboto_thin': require('./app/assets/fonts/Roboto-Thin.ttf'),
		});
		this.setState({fontLoaded: true})
	}

	render() {
		if (!this.state.fontLoaded) {
			return (
				<Root>
					<AppLoading/>
				</Root>
			);
		}
		return (
			<Provider store={reduxStore}>
				<AppContainer/>
			</Provider>
		);
	}
}
