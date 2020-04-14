import {StyleSheet, Dimensions} from "react-native";

const WIDTH = Dimensions.get("window").width; //Max Width of phone screen
const HEIGHT = Dimensions.get("window").height; //Max Height of phone screen

export default (styles = StyleSheet.create({
	text: {
		fontWeight: 'bold',
		fontSize: 24
	},
	subText: {
		fontSize: 18
	},
	segmentText: {
		fontSize: 24,
		color: 'white',
	},
	container: {
		flex: 1
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		opacity: 0.5,
		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center'
	},
	pdf: {
		flex:1,
		width: WIDTH,
		height: HEIGHT,
	},
	infoText: {
		fontSize: 30,
		fontFamily: 'Roboto',
		marginTop: 30,
		textAlign: 'center'
	},
}));
