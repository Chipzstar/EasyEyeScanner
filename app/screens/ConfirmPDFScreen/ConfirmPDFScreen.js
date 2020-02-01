import React, {Component} from 'react';
import {Container, Content, Header, Form, Item, Label, Input, ListItem, CheckBox, Body, Text} from "native-base";

export default class ConfirmPDFScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveToGallery: false
		};
	}

	componentDidMount() {
		const date = new Date().getDate();
		const month = new Date().getMonth() + 1; //Current Month
		const year = new Date().getFullYear();
		this.setState({date: date + '/' + month + '/' + year});
	}

	render() {
		let {saveToGallery} = this.state;
		return (
			<Container>
				<Header/>
				<Content>
					<Form>
						<Item floatingLabel>
							<Label>Name of PDF</Label>
							<Input placeholder={`Scan ${this.state.date}`}/>
						</Item>
					</Form>
					<ListItem>
						<CheckBox checked={saveToGallery}
						          onPress={() => this.setState({saveToGallery: !saveToGallery})}/>
						<Body>
							<Text>Gallery</Text>
						</Body>
					</ListItem>
				</Content>
			</Container>
		)
	}
}
