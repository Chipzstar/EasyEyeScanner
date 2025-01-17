import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Modal,
	ActivityIndicator, Text
} from 'react-native';

const Loader = props => {
	const {
		loading,
		...attributes
	} = props;

	return (
		<Modal
			transparent={true}
			animationType={'fade'}
			visible={loading}
			onRequestClose={() => {console.log('close modal')}}>
			<View style={styles.modalBackground}>
				<View style={styles.activityIndicatorWrapper}>
					<ActivityIndicator size={"large"} animating={loading} />
					<Text style={{fontSize: 23}}>Loading...</Text>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: '#00000040'
	},
	activityIndicatorWrapper: {
		backgroundColor: '#FFFFFF',
		height: 120,
		width: 120,
		borderRadius: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around'
	}
});

export default Loader;
