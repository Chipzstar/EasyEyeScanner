import React, {Component} from 'react';
import {FlatList, Image, View, TouchableOpacity, StyleSheet} from "react-native";
import {
	Container,
	Content,
	Header,
	Form,
	Item,
	Label,
	Input,
	ListItem,
	CheckBox,
	Separator,
	Body,
	Right,
	Title,
	Text,
	Button,
	Thumbnail, Icon, Left
} from "native-base";
import {connect} from 'react-redux';

class ConfirmPDFScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveToGallery: false,
		};
	}

	componentDidMount() {
		const date = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		this.setState({date: date + '/' + month + '/' + year});
		this.setState({uri: String(this.props.captures[0].uri)});
	}

	scan = () => {

	};

	render() {
		let {saveToGallery} = this.state;
		return (
			<Container>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body>
						<Title>Review PDF</Title>
					</Body>
					<Right/>
				</Header>
				<Content contentContainerStyle={{flexGrow: 1}}>
					<Form>
						<Item>
							<Label style={{fontWeight: 'bold'}}>Name of PDF</Label>
							<Input placeholder={`Scan - ${this.state.date}`}/>
						</Item>
					</Form>
					<Separator bordered>
						<Text style={styles.subtitle}>Images</Text>
					</Separator>
					<ListItem>
						<FlatList
							keyExtractor={(item) => this.props.captures.indexOf(item).toString()}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={this.props.captures}
							renderItem={({item}) => (
								<TouchableOpacity style={styles.thumbnail}
								                  onPress={() => this.setState({uri: item.uri})}>
									<Thumbnail square large source={{uri: item.uri}}/>
								</TouchableOpacity>
							)}
						/>
					</ListItem>
					<Separator bordered>
						<Text style={styles.subtitle}>Preview</Text>
					</Separator>
					<ListItem style={{
						flex: 1,
						alignItems: 'center',
						alignSelf: 'center'
					}}>
						{this.state.uri && <Image source={{uri: this.state.uri}} style={{width: 250, height: 250}}/>}
					</ListItem>
					<Separator bordered>
						<Text style={styles.subtitle}>Options</Text>
					</Separator>
					<ListItem>
						<CheckBox checked={saveToGallery}
						          onPress={() => this.setState({saveToGallery: !saveToGallery})}/>
						<Body>
							<Text>Save PDF to Gallery</Text>
						</Body>
					</ListItem>
					<View style={styles.bottom}>
						<Button large info onPress={() => this.scan()}>
							<Text style={{textAlign: 'center'}}>Save!</Text>
						</Button>
					</View>
				</Content>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		captures: state.captures.captures
	}
};

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
	mapStateToProps
);

const ConnectedComponent = connectToStore(ConfirmPDFScreen);

export default ConnectedComponent;

const styles = StyleSheet.create({
	thumbnail: {
		paddingHorizontal: 5
	},
	bottom: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingVertical: 25
	},
	subtitle: {
		fontSize: 18
	}
});
