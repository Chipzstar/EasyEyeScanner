import {StyleSheet, Dimensions} from "react-native";

const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
const {height: HEIGHT} = Dimensions.get("window"); //Max Height of phone screen

export default (styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative'
	},
	emptyStay: {
		textAlign: 'center',
	},
	countBadge: {
		paddingHorizontal: 8.6,
		paddingVertical: 5,
		borderRadius: 50,
		position: 'absolute',
		right: 3,
		bottom: 3,
		justifyContent: 'center',
		backgroundColor: '#0580FF'
	},
	countBadgeText: {
		fontWeight: 'bold',
		alignSelf: 'center',
		padding: 'auto',
		color: '#ffffff'
	}
}));
