import {StyleSheet, Dimensions} from "react-native";

const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
const {height: HEIGHT} = Dimensions.get("window"); //Max Height of phone screen

export default (styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
		paddingHorizontal: 20,
	},
	thumbnail: {
		width: 300,
		height: 300,
		resizeMode: "contain"
	}
}));
