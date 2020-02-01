import {StyleSheet, Dimensions} from "react-native";
import {Header} from "native-base";
import React from "react";

const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
const {height: HEIGHT} = Dimensions.get("window"); //Max Height of phone screen

export default (styles = StyleSheet.create({
	alignCenter: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	preview: {
		height: HEIGHT,
		width: WIDTH,
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},
	topToolbar: {
		height: 45,
		borderColor: 'red',
		borderStyle: 'solid',
		borderWidth: 2,
		color: 'transparent'
		//left: WIDTH*0.5,
		//alignSelf: 'flex-end'
	},
	bottomToolbar: {
		width: WIDTH,
		position: 'absolute',
		height: 100,
		bottom: 0,
	},
	captureBtn: {
		width: 60,
		height: 60,
		borderWidth: 2,
		borderRadius: 60,
		borderColor: "#FFFFFF",
	},
	captureBtnActive: {
		width: 80,
		height: 80,
	},
	captureBtnInternal: {
		width: 76,
		height: 76,
		borderWidth: 2,
		borderRadius: 76,
		borderStyle: 'solid',
		borderColor: "red",
	},
	galleryContainer: {
		bottom: 100
	},
	galleryImageContainer: {
		width: 75,
		height: 75,
		marginRight: 5
	},
	galleryImage: {
		width: 75,
		height: 75
	},
	iconText: {
		color: 'white'
	}
}));

//{borderColor: 'red', borderStyle: 'solid', borderWidth: 2}
