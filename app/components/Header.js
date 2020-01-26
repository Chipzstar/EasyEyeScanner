import React from "react";
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from "react-native";
import {MaterialIcons} from '@expo/vector-icons';

const HEIGHT = Dimensions.get('window').height;

export default function Header({title, hasBackButton, navigation}) {
	const openMenu = () => {
		navigation.openDrawer();
	};

	const goBack = () => {
		console.log(navigation);
		navigation.goBack();
	};

	return (
		<View style={styles.header}>
			{hasBackButton ? (
				<TouchableOpacity onPress={goBack} style={styles.headerIcon}>
					<MaterialIcons name='arrow-back' size={28}/>
				</TouchableOpacity>
			) : (
				<TouchableOpacity onPress={openMenu} style={styles.headerIcon}>
					<MaterialIcons name='menu' size={28}/>
				</TouchableOpacity>
			)}
			<View style={styles.headerTitle}>
				<Text style={styles.headerText}>{title}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginTop: 25,
		width: '100%',
		height: 0.1 * HEIGHT,
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: 'red',
		borderStyle: 'solid'
	},
	headerTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center'
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 20,
		color: '#333',
		letterSpacing: 1
	},
	headerIcon: {
		position: 'absolute',
		left: 16,
		top: 25
	}
});
