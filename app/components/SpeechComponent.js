import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import * as Speech from 'expo-speech';
import {Container, Content, Footer, FooterTab, Button, ActionSheet} from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const BUTTONS = [
	{text: "Increase Font Size", icon: "arrow-round-up", iconColor: "#0c9809"},
	{text: "Decrease Font Size", icon: "arrow-round-down", iconColor: "red"},
	{text: "Increase Speech Rate", icon: "arrow-round-up", iconColor: "#0c9809"},
	{text: "Decrease Speech Rate", icon: "arrow-round-down", iconColor: "red"},
	{text: "Cancel", icon: "close", iconColor: "blue"}
];

const CANCEL_INDEX = 4;

export default class SpeechComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			txtSpeak: "Loading...",
			currentSizeIndex: 4,
			fontSizes: [18, 20, 22, 24, 26, 28, 30, 32, 36, 40],
			clicked: null,
			pitch: 1,
			rate: 1
		};
	}

	componentDidMount() {
		this.props.data ? this.setState({txtSpeak: this.props.data}) : console.log("waiting for data prop...");
		Speech.getAvailableVoicesAsync().then(r => console.log(r.slice(0, 10)));
	};

	_stopHandler() {
		Speech.stop().then(r => console.log('Speech stopped'));
	};

	_startHandler = () => {
		Speech.isSpeakingAsync().then(speaking => {
			if (speaking) this._stopHandler();
		});
		Speech.speak(this.state.txtSpeak, {
			language: 'en',
			pitch: this.state.pitch,
			rate: this.state.rate
		});
		console.log('Speech started...');
	};

	render() {
		const {txtSpeak, currentSizeIndex, fontSizes, rate} = this.state;
		return (
			<Container style={styles.container}>
				<Content>
					<Text style={{fontSize: fontSizes[currentSizeIndex]}}>{txtSpeak}</Text>
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical onPress={() => this._startHandler()}>
							<MaterialCommunityIcons name={"play"} color={"white"} size={28}/>
							<Text style={styles.iconText}>Play</Text>
						</Button>
						<Button vertical onPress={() => this._stopHandler()}>
							<MaterialCommunityIcons name={"stop"} color={"white"} size={28}/>
							<Text style={styles.iconText}>Stop</Text>
						</Button>
						<Button vertical onPress={() =>
							ActionSheet.show(
								{
									options: BUTTONS,
									cancelButtonIndex: CANCEL_INDEX,
									title: "Options"
								},
								buttonIndex => {
									console.log(buttonIndex);
									if (buttonIndex === 0) {
										this.setState({currentSizeIndex: currentSizeIndex < fontSizes.length - 1 ?
												currentSizeIndex + 1 : currentSizeIndex});
										/*console.log("index:", currentSizeIndex + 1);
										console.log("Current font size:",fontSizes[currentSizeIndex + 1]);*/
									}
									else if (buttonIndex === 1) {
										this.setState({currentSizeIndex: currentSizeIndex > 0 ?
												currentSizeIndex - 1 : currentSizeIndex});
										/*console.log("index", currentSizeIndex - 1);
										console.log("Current font size:",fontSizes[currentSizeIndex - 1]);*/
									}
									else if (buttonIndex === 2) {
										this.setState({rate: rate < 5 ? rate + 0.5 : rate});
										this._startHandler();
										console.log("Current speech rate:", rate + 0.5);
									}
									else if (buttonIndex === 3) {
										this.setState({rate: rate > 0 ? rate - 0.5 : rate});
										this._startHandler();
										console.log("Current speech rate:", rate - 0.5);
									}
									this.setState({clicked: BUTTONS[buttonIndex]});
								}
							)}
						>
							<MaterialCommunityIcons name={"settings"} color={"white"} size={28}/>
							<Text style={styles.iconText}>Options</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	iconText: {
		color: 'white'
	},
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	}
});
