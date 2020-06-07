import React, {Component} from 'react';
import {Text, View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import * as Speech from 'expo-speech';
import {
	Container,
	Content,
	Footer,
	FooterTab,
	Button,
	ActionSheet
} from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const MAIN_OPTIONS = [
	{text: "Increase Font Size", icon: "arrow-round-up", iconColor: "#0c9809"},
	{text: "Decrease Font Size", icon: "arrow-round-down", iconColor: "red"},
	{text: "Increase Speech Rate", icon: "arrow-round-up", iconColor: "#0c9809"},
	{text: "Decrease Speech Rate", icon: "arrow-round-down", iconColor: "red"},
	{text: "Change Contrast", icon: "contrast", iconColor: "orange"},
	{text: "Cancel", icon: "close", iconColor: "blue"}
];

const pickerValues = [
	{
		title: 'Black on White (Default)',
		color: 'black',
		backgroundColor: '#F5FCFF'
	},
	{
		title: 'White on Black (Inverted)',
		color: 'white',
		backgroundColor: '#333333'
	},
	{
		title: 'Yellow on Black',
		color: '#fccb00',
		backgroundColor: '#333333'
	}
]

export default class SpeechComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			txtSpeak: "Loading...",
			currentSizeIndex: 4,
			fontSizes: [18, 20, 22, 24, 26, 28, 30, 32, 36, 40],
			clicked: null,
			pickerDisplayed: false,
			pickerSelection: {
				color: 'black',
				backgroundColor: '#F5FCFF'
			},
			pitch: 1,
			rate: 1
		};
	}

	componentDidMount() {
		this.props.data ? this.setState({txtSpeak: this.props.data}) : console.log("waiting for data prop...");
		//Speech.getAvailableVoicesAsync().then(r => console.log(r.slice(0, 3)));
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

	setPickerValue(newValue) {
		this.setState({pickerSelection: newValue})
		this.togglePicker();
	}

	togglePicker() {
		this.setState({pickerDisplayed: !this.state.pickerDisplayed})
	}

	render() {
		const {txtSpeak, currentSizeIndex, fontSizes, rate, pickerDisplayed, pickerSelection} = this.state;
		const contrastModal = (
			<Modal visible={pickerDisplayed} animationType={"slide"} transparent={true}>
				<View style={{
					margin: 20,
					padding: 20,
					backgroundColor: '#efefef',
					bottom: 35,
					left: 20,
					right: 20,
					borderRadius: 10,
					shadowOffset:{  width: 10,  height: 10},
					shadowColor: 'black',
					shadowOpacity: 1.0,
					alignItems: 'center',
					position: 'absolute'
				}}>
					<Text style={{fontSize: 15}}>Please pick a contrast mode</Text>
					{pickerValues.map((item, index) => {
						return (
							<TouchableOpacity
								key={index}
								onPress={() => this.setPickerValue(item)}
								style={{paddingTop: 5, paddingBottom: 5}}
							>
								<View>
									<Text style={{fontSize: 20}}>{item.title}</Text>
								</View>
							</TouchableOpacity>
						)
					})}
				</View>
			</Modal>
		)
		return (
			<Container style={{flex: 1, backgroundColor: pickerSelection.backgroundColor}}>
				<Content>
					{contrastModal}
					<Text
						style={{fontSize: fontSizes[currentSizeIndex], color: pickerSelection.color}}>{txtSpeak}</Text>
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
									options: MAIN_OPTIONS,
									cancelButtonIndex: MAIN_OPTIONS.length - 1,
									title: "Options"
								},
								buttonIndex => {
									if (buttonIndex === 0) {
										this.setState({
											currentSizeIndex: currentSizeIndex < fontSizes.length - 1 ?
												currentSizeIndex + 1 : currentSizeIndex
										});
									} else if (buttonIndex === 1) {
										this.setState({
											currentSizeIndex: currentSizeIndex > 0 ?
												currentSizeIndex - 1 : currentSizeIndex
										});
									} else if (buttonIndex === 2) {
										this.setState({rate: rate < 5 ? rate + 0.5 : rate});
										this._startHandler();
										console.log("Current speech rate:", rate + 0.5);
									} else if (buttonIndex === 3) {
										this.setState({rate: rate > 0 ? rate - 0.5 : rate});
										this._startHandler();
										console.log("Current speech rate:", rate - 0.5);
									} else if (buttonIndex === 4) {
										this.setState({pickerDisplayed: true})
									}
									this.setState({clicked: MAIN_OPTIONS[buttonIndex]});
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
	}
});
