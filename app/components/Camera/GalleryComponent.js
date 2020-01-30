import React from 'react';
import {TouchableOpacity, Image, ScrollView} from 'react-native';

import styles from './styles';

export default ({captures = [], navigation}) => (
	<ScrollView
		horizontal={true}
		style={[styles.bottomToolbar, styles.galleryContainer]}
	>
		{captures.map(({uri, height, width}) => (
			<TouchableOpacity style={styles.galleryImageContainer} key={uri} onPress={() => navigation.navigate('ImagePreview', {uri: uri, width: width, height: height})}>
				<Image source={{uri}} style={styles.galleryImage}/>
			</TouchableOpacity>
		))}
	</ScrollView>
);
