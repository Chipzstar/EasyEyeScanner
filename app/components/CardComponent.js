import React from 'react';
import {Image, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import {Body, CardItem, Icon, Left, Right, Thumbnail, Card} from "native-base";
import thumbnail from "../assets/images/document-thumbnail.png";
import {withNavigation} from 'react-navigation'
import {useDispatch} from "react-redux";
import {Storage, Auth} from 'aws-amplify';


//actions
import {removeDocument} from "../../store/actions/documentsAction";

const removeFromS3 = (documentName) => {
	Auth.currentCredentials().then(r => {
		Storage.list(`${documentName}/`, {level: 'private', identityId: r.identityId})
			.then(result => {
				result.forEach(obj => {
					Storage.remove(obj.key, {
						level: 'private',
						identityId: r.identityId
					}).then(result => console.log(result)).catch(err => console.error(err));
				});
				console.log(result)
			})
			.catch(err => console.log("Error", err));
	}).catch(err => console.error("Error", err));
};

const CardComponent = props => {
	const dispatch = useDispatch();
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
				<Left style={{flex: 1, justifyContent: 'center'}}>
					<TouchableOpacity
						accessibilityLabel={"Share"}
						accessibilityHint={"Social media share"}
						accessibilityRole={"button"}
						style={{flexDirection: 'row', alignItems: 'center', height: 30}}>
						<Icon name={"share"}/>
						<Text style={styles.iconText}>Share</Text>
					</TouchableOpacity>
				</Left>
				<Body style={{flex: 1, justifyContent: 'center'}}>
					<TouchableOpacity
						accessibilityLabel={"Read"}
						accessibilityHint={"Opens the document in screen reader"}
						accessibilityRole={"button"}
						style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', height: 30}}
						onPress={() => props.navigation.navigate('ReaderScreen', {documentID: props.id})}
					>
						<Icon name={"book"}/>
						<Text style={styles.iconText}>Read</Text>
					</TouchableOpacity>
				</Body>
				<Right style={{flex: 1, justifyContent: 'center'}}>
					<TouchableOpacity
						transparent
						accessibilityLabel={"Delete"}
						accessibilityHint={"Removes the document from app"}
						accessibilityRole={"button"}
						style={{flexDirection: 'row', alignItems: 'center', height: 30}}
						onPress={() => {
							Alert.alert(
								"Warning",
								"Are you sure you want to delete this document?",
								[
									{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
									{
										text: 'Delete', onPress: () => {
											dispatch(removeDocument(props.image));
											ToastAndroid.showWithGravity(
												"Document has been deleted!",
												ToastAndroid.LONG,
												ToastAndroid.CENTER,
											);
											removeFromS3(props.name);
										}, style: 'destructive'
									}
								]
							)
						}}
					>
						<Icon name={"trash"} fontSize={32}/>
						<Text style={styles.iconText}>Delete</Text>
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
