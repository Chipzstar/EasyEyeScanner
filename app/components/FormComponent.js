import React, {Component} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, BackHandler} from 'react-native';
import 'react-native-console-time-polyfill';
import {entries} from "d3-collection";
import {Container, Header, Item, Button, Icon, Input, Left, Body, Title, Right} from 'native-base';

class FormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keys: [],
			showSearchBar: false
		};
	}

	componentDidMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
		this.props.data ? this.setState({formData: this.props.data}) : console.log("waiting for data prop...");
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	handleBackButtonPressAndroid = () => {
		this.props.hideForm();
		return true;
	};

	_renderItem = ({item}) => {
		return (
			<View style={styles.flatView}>
				<Text style={styles.key}>Key: {item.key}</Text>
				<Text style={styles.value}>Value: {item.value}`</Text>
			</View>
		)
	};

	_renderFooter = () => {
		return (
			<View
				style={{
					height: 25,
					marginVertical: 25
				}}
			/>
		)
	};

	_renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "86%",
					marginVertical: 15,
					backgroundColor: "#CED0CE"
				}}
			/>
		);
	};

	getKeyByValue(object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}

	searchFilterFunction = text => {
		if (this.props.data) {
			let newObj = {}, KVP = {};
			let textData = text.toUpperCase();
			console.log(this.props.data);
			console.log("current text:", textData);
			const newDataKeys = Object.keys(this.props.data).filter(key => key.toUpperCase().includes(textData));
			KVP = Object.entries(this.props.data).filter(pair => newDataKeys.includes(pair[0]));
			newObj = Object.fromEntries(KVP);
			const newDataValues = Object.values(this.props.data).filter(value => value.toUpperCase().includes(textData));
			KVP = Object.entries(this.props.data).filter(pair => newDataValues.includes(pair[1]));
			Object.assign(newObj, Object.fromEntries(KVP));
			console.table(newObj);
			this.setState({formData: newObj});
		}
	};

	render() {
		const {formData, showSearchBar} = this.state;
		const searchBar = (
			<Header searchBar rounded transparent>
				<Item>
					<Icon name="ios-search"/>
					<Input
						placeholder="Search"
						onChangeText={text => this.searchFilterFunction(text)}
						autoCorrect={false}
						onSubmitEditing={() => this.setState({showSearchBar: false})}
						onFocus={() => console.log("focus received")}
						onBlur={() => {
							console.log("focus lost");
							this.setState({showSearchBar: false});
						}}
					/>
				</Item>
				<Button transparent>
					<Text>Search</Text>
				</Button>
			</Header>
		);
		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Container style={styles.container}>
					{showSearchBar ? searchBar :
						<Header>
							<Left style={{flex: 1}}>
								<Button transparent onPress={() => this.props.hideForm()}>
									<Icon name="arrow-back"/>
								</Button>
							</Left>
							<Body>
								<Title>Form Data</Title>
							</Body>
							<Right style={{flex: 1}}>
								<Button transparent onPress={() => this.setState({showSearchBar: true})}>
									<Icon name="search"/>
								</Button>
							</Right>
						</Header>
					}
					<View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
						{this.props.data ?
							<FlatList
								data={entries(formData)}
								renderItem={this._renderItem}
								keyExtractor={(item => item.key)}
								showsVerticalScrollIndicator={true}
								ItemSeparatorComponent={this._renderSeparator}
								ListFooterComponent={this._renderFooter}
							>
							</FlatList>
							: <Text style={styles.infoText}>There is no form data for this document!</Text>
						}
					</View>
				</Container>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	infoText: {
		fontSize: 30,
		fontFamily: 'Roboto',
		marginTop: 30,
		textAlign: 'center'
	},
	flatView: {
		justifyContent: 'flex-start',
		borderRadius: 2,
	},
	key: {
		fontFamily: 'Roboto',
		fontSize: 20
	},
	value: {
		fontSize: 16,
		color: 'red'
	}
});

export default FormComponent;
