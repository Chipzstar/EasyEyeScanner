import React, {Component} from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Body, Button, CardItem, Icon, Left, Right, Thumbnail, Card} from "native-base";
import thumbnail from "../assets/images/document-thumbnail.png";
import {withNavigation} from 'react-navigation';

const CardComponent = props => {
	return (
		<Card>
			<CardItem>
				<Left>
					<Thumbnail source={thumbnail}/>
					<Body>
						<Text style={styles.title}>{props.name}</Text>
						<Text note>{props.date}</Text>
					</Body>
				</Left>
			</CardItem>
			<CardItem cardBody>
				<Image source={props.image} style={{height: 200, width: null, flex: 1}}/>
			</CardItem>
			<CardItem>
				<Left>
					<TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Icon name={"share"}/>
						<Text style={styles.iconText}>Share</Text>
					</TouchableOpacity>
				</Left>
				<Body>
					<TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
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
