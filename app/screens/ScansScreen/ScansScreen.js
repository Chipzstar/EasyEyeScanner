import React, {Component} from 'react';
//import {Text, View, Image} from 'react-native';
import {Container, Header, Button, Body, Title, Left, Right, Icon, Content} from "native-base";
//import DocumentScanCard from '../../components/CardTile';
//import card_image_1 from "../../assets/images/card-image.png";

//styles
//import styles from "./styles";

class ScansScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "Chisom",
			active: false
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

				<Content>
					{/*<DocumentScanCard name={"Document 1"} date={this.state.date} image={card_image_1}/>*/}
				</Content>
				{/*<Fab
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
				</Fab>*/}
			</Container>
		)
	}
}

export default ScansScreen;
