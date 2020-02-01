import React from 'react';
import {TouchableOpacity, Image, ScrollView} from 'react-native';
import {useSelector} from "react-redux";

import styles from './styles';

const GalleryComponent = ({navigation}) => {
	const currentCaptures = useSelector(state => state.captures.captures,);
	console.log("Gallery Component: \n", currentCaptures);
	return (
		<ScrollView
			horizontal={true}
			style={[styles.bottomToolbar, styles.galleryContainer]}
		>
			{currentCaptures.map(({uri, height, width}) => (
				<TouchableOpacity style={styles.galleryImageContainer} key={uri}
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
