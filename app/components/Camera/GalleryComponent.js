import React from 'react';
import {TouchableOpacity, Image, ScrollView} from 'react-native';
import {useSelector} from "react-redux";

import styles from './styles';

const GalleryComponent = ({navigation}) => {
	const currentCaptures = useSelector(state => state.captures.captures);
	return (
		<ScrollView
			horizontal={true}
			style={[styles.bottomToolbar, styles.galleryContainer]}
		>
			{currentCaptures.map(({uri, height, width}) => (
				<TouchableOpacity
					accessibilityLabel={"Image capture thumbnail"}
					accessibilityHint={"Click to show full screen preview of image"}
					accessibilityRole={"imagebutton"}
					style={styles.galleryImageContainer}
					key={uri}
					onPress={() => navigation.navigate('ImagePreview', {
						uri: uri,
						width: width,
						height: height
					})}>
					<Image source={{uri}} style={styles.galleryImage}/>
				</TouchableOpacity>
			))}
		</ScrollView>
	)
};

export default GalleryComponent;
