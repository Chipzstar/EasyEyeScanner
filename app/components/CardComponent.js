import React, { useState, useEffect } from 'react';
import {
	Image,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ToastAndroid
} from 'react-native';
import {Body, CardItem, Icon, Left, Right, Thumbnail, Card} from "native-base";
import thumbnail from "../assets/images/document-thumbnail.png";
import {useSelector, useDispatch} from "react-redux";
import {Storage, Auth} from 'aws-amplify';
import { withNavigation } from "react-navigation";
//actions
import {removeDocument, updateDocument} from "../../store/actions/documentsAction";
//functions
import textExtraction from "../functions/textExtraction";

const APICallLimit = 12;

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
	const document = useSelector(state => state.documents.documents);
	const [loading, setLoading] = useState(true);
	const [apiCallCount, setAPITracker] = useState(0);
	const [status, setStatus] = useState(document[props.id]['status']);
	useEffect(() => {
		const timer = setTimeout(() => {
			let key = document[props.id]['S3BucketKey'].split('.pdf').join('.txt');
			console.log(key);
			textExtraction(key).then(res => {
				console.log(res);
				if (res["SUCCESS"]) setLoading(false);
				else if (status === "FAILED") setLoading(false);
				else if (apiCallCount > APICallLimit) {
					setStatus("FAILED");
					document[props.id]['status'] = "FAILED";
					dispatch(updateDocument(props.image, document[props.id]));
					setLoading(false);
				} else {
					setAPITracker(apiCallCount + 1);
					console.log("Number of calls:", apiCallCount);
				}
			}).catch(err => {
				console.error(err);
			});
		}, 5000);
		return () => clearTimeout(timer)
	}, [apiCallCount]);
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
						style={{flexDirection: 'row', alignItems: 'center', height: 30}}
					>
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
						onPress={() => {
							loading ?
								Alert.alert(
									"Document still being processed...",
									"Make sure you have an internet connection before trying to read this document",
									[
										{text: "Ok", onPress: () => console.log("Ok pressed"), style: "default"}
									]
								) : status === "FAILED" ?
								Alert.alert("ERROR! Could not perform OCR", "This document encountered a problem during processing. Please check the Help section to see why this may happen", [
									{
										text: "Go to Help section",
										onPress: () => props.navigation.dangerouslyGetParent().navigate({routeName:'HelpScreen'}),
										style: "default"
									},
									{
										text: 'Delete this document', onPress: () => {
											dispatch(removeDocument(props.image));
											ToastAndroid.showWithGravity(
												"Document has been deleted!",
												ToastAndroid.LONG,
												ToastAndroid.TOP,
											);
											removeFromS3(props.name);
										}, style: 'destructive'
									},
									{text: "Cancel", onPress: () => console.log("Cancel pressed"), style: "cancel"}
								]) :
								props.navigation.navigate('ReaderScreen', {documentID: props.id});
						}}
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
												ToastAndroid.TOP,
											);
											removeFromS3(props.name);
										}, style: 'destructive'
									}
								]
							)
						}}
					>
						<Icon name={"trash"} fontSize={32} color={'black'}/>
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
