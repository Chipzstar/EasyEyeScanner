import React, {Component} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {Body, Button, CardItem, Icon, Left, Right, Thumbnail, Card} from "native-base";
import thumbnail from "../assets/images/document-thumbnail.png";
import {withNavigation} from 'react-navigation';

const CardTile = props => {
	return (
		<Card>
			<CardItem>
				<Left>
					<Thumbnail source={thumbnail}/>
					<Body>
						<Text>{props.name}</Text>
						<Text note>{props.date}</Text>
					</Body>
				</Left>
			</CardItem>
			<CardItem cardBody>
				<Image source={props.image} style={{height: 200, width: null, flex: 1}}/>
			</CardItem>
			<CardItem>
				<Left>
					<Button transparent>
						<Icon name={"share"}/>
						<Text>Share</Text>
					</Button>
				</Left>
				<Body>
					<Button transparent>
						<Icon name={"book"}/>
						<Text>Read</Text>
					</Button>
				</Body>
				<Right>
					<Icon name={"more"}/>
					<Text>More</Text>
				</Right>
			</CardItem>
		</Card>
	)
};

const styles = StyleSheet.create({});

export default withNavigation(CardTile);
