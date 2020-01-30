import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Container, Content, Header, Right, Left, Body, Icon, Footer, FooterTab, Segment, Button } from 'native-base'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default class ImagePreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accept: true,
			discard: false
		};
	}

	render() {
		const photoData = Object.assign(this.props.navigation.state.params);
		const { accept, discard } = this.state;
		//const ratio = photoData.height / photoData.width;
		console.log("Image data: ", photoData);
		return (
			<Container>
				<Header hasSegment>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body style={{flex: 1}}>
						<Segment>
							<Button first active={accept} onPress={() => this.setState({accept : true, discard: false})}>
								<Icon name="checkmark"/>
							</Button>
							<Button last active={discard} onPress={() => this.setState({accept : false, discard: true})}>
								<Icon name="close"/>
							</Button>
						</Segment>
					</Body>
					<Right/>
					<Button transparent>
						<Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Confirm</Text>
					</Button>
				</Header>
				<Content padder>
					<Image source={{uri: photoData.uri}} style={{flex: 1, justifyContent: 'center', alignItems: 'center', aspectRatio: 0.5}} resizeMode="contain"/>
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical>
							<MaterialCommunityIcons name={"file-replace"} size={28} color={'white'}/>
							<Text style={styles.iconText}>Replace</Text>
						</Button>
						<Button vertical>
							<MaterialIcons name={'rotate-right'} size={28} color={'white'}/>
							<Text style={styles.iconText}>Rotate</Text>
						</Button>
						<Button vertical active>
							<Icon name="crop"/>
							<Text style={styles.iconText}>Crop</Text>
						</Button>
						<Button vertical>
							<MaterialIcons name={'delete'} size={28} color={'white'}/>
							<Text style={styles.iconText}>Delete</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		)
	}
}
