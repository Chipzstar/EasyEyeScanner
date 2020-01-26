import React, {Component } from 'react';
import {Container, Header, Button, Body, Title, Left, Right, Icon, Content, Fab} from "native-base";
import {FlatList, View} from "react-native";
import DocumentScanCard from '../../components/CardTile';
import card_image_1 from "../../assets/images/card-image.png";
import card_image_2 from "../../assets/images/card-image-2.png";

import card_image_3 from "../../assets/images/card-image-3.png";
//styles
import styles from "./styles";

class ScansScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "Chisom",
			active: false,
			documents: [
				{title: "Document 1", imageURI: card_image_1},
				{title: "Document 2", imageURI: card_image_2},
				{title: "Document 3", imageURI: card_image_3},
			]
		};
	}

	componentDidMount() {
		const date = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		this.setState({date: date + '/' + month + '/' + year});//Current Year
	}

	render() {
		const { navigation } = this.props;
		let documents = this.state.documents;
		return (
			<Container>
				<Header iosBarStyle={"dark-content"}>
					<Left>
						<Button
							transparent
							onPress={() => navigation.openDrawer()}
						>
							<Icon name='menu' />
						</Button>
					</Left>
					<Body>
						<Title>My Scans</Title>
					</Body>
					<Right>
						<Button transparent>
							<Icon name='more' />
						</Button>
					</Right>
				</Header>

				<Content padder
					style={{flex: 1}}
					contentContainerStyle={{flex: 1}} // important!
				>
					<FlatList
						data={this.state.documents}
						renderItem={({item}) => (
							<DocumentScanCard name={item.title} date={this.state.date} image={item.imageURI}/>
						)}
						keyExtractor={(item) => documents.indexOf(item).toString()}
						showsVerticalScrollIndicator={false}
					>
					</FlatList>
				</Content>
				<Fab
					active={this.state.active}
					direction="up"
					containerStyle={{ }}
					style={{ backgroundColor: '#5067FF' }}
					position="bottomRight"
					onPress={() => this.setState({ active: !this.state.active })}>
					<Icon name="add" />
					<Button style={{ backgroundColor: '#34A34F' }}>
						<Icon name="camera" />
					</Button>
					<Button style={{ backgroundColor: '#3B5998' }}>
						<Icon name="image" />
					</Button>
				</Fab>
			</Container>
		)
	}
}

export default ScansScreen;
