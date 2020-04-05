import React, {Component} from 'react';
import {Button, View} from 'react-native';
import * as Speech from 'expo-speech';

export default class SpeechComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			txtSpeak: "Welcome to Speech text video"
		};
	}

	componentDidMount() {
		Speech.getAvailableVoicesAsync().then(r => console.log(r.slice(0, 3)));
	};

	_pauseHandler() {
		Speech.pause().then(r => console.log('Speech paused...') );
	};

	_resumeHandler() {
		Speech.resume().then(r => console.log('Speech resumed...'));
	};

	_stopHandler() {
		Speech.stop().then(r => console.log('Speech stopped'));
	};

	_startHandler = () => {
		Speech.speak(this.state.txtSpeak, {
			language: 'en',
			pitch: 1,
			rate: 1
		})
	};

	render() {
		return (
			<View>
				<Button onPress={this._startHandler} title={"Speak"}/>
				<Button onPress={this._pauseHandler} title={"Pause"}/>
				<Button onPress={this._resumeHandler} title={"Resume"}/>
				<Button onPress={this._stopHandler} title={"Stop"}/>
			</View>
		)
	}
}
