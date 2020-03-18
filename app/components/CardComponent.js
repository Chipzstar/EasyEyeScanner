import React from 'react';
import {Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Body, CardItem, Icon, Left, Right, Thumbnail, Card} from "native-base";
import thumbnail from "../assets/images/document-thumbnail.png";
import {withNavigation} from 'react-navigation';

//functions
import TextIdentification from "../functions/textExtraction";

const CardComponent = props => {
	return (
		<Card>
			<CardItem
				accessibilityLabel={"Document Details"}
			    accessibilityHint={"Contains the name and date of when the document was taken"}
			>
				<Left>
					<Thumbnail source={thumbnail}/>
					<Body>
						<Text style={styles.title}>{props.name}</Text>
						<Text note>{props.date}</Text>
					</Body>
				</Left>
			</CardItem>
			<CardItem
				accessibilityLabel={"Document Image"}
				accessibilityHint={"Shows preview of the first page of the document"}
				cardBody>
				<Image source={{uri: props.image}} style={{height: 200, width: null, flex: 1}}/>
			</CardItem>
			<CardItem
				accessibilityLabel={"Options"}
				accessibilityRole={"toolbar"}
			>
				<Left>
					<TouchableOpacity
						accessibilityLabel={"Share"}
						accessibilityHint={"Social media share"}
						accessibilityRole={"button"}
						style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Icon name={"share"}/>
						<Text style={styles.iconText}>Share</Text>
					</TouchableOpacity>
				</Left>
				<Body>
					<TouchableOpacity
						accessibilityLabel={"Read"}
						accessibilityHint={"Opens the document in screen reader"}
						accessibilityRole={"button"}
						style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Icon name={"book"}/>
						<Text style={styles.iconText}>Read</Text>
					</TouchableOpacity>
				</Body>
				<Right>
					<TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Icon name={"more"} color={'black'} fontSize={20}/>
						<Text style={styles.iconText}>More</Text>
					</TouchableOpacity>
				</Right>
			</CardItem>
		</Card>
	)
};

const styles = StyleSheet.create({
	title: {
		fontSize: 20
	},
	iconText: {
		paddingHorizontal: 10,
		fontSize: 20
	}
});

export default withNavigation(CardComponent);
