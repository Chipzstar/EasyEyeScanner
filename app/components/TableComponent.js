import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, BackHandler} from 'react-native';
import {Table, Row, Rows, Col, Cols, Cell, TableWrapper} from 'react-native-table-component';

export default class TableComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: []
		};
	}

	componentDidMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
		this.props.data ? this.setState({tableData: this.props.data}) : console.log("waiting for data prop...");
	}

	handleBackButtonPressAndroid = () => {
		this.props.hideTables();
		return true;
	};

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	render() {
		const { tableData } = this.state;

		return (
			<View style={styles.container}>
				<Text style={styles.h1text}>Table {this.props.index+1}</Text>
				<ScrollView horizontal={true}>
					<View>
						<ScrollView>
							<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
								{this.props.data && tableData.map((rowData, index) => (
									<Row
										key={index}
										data={rowData}
										widthArr={Array.from(this.props.data[0]).fill(100)}
										style={[styles.row, index % 2 && {backgroundColor: '#F7F6E7'}]}
										textStyle={styles.text}
									/>
								))}
							</Table>
						</ScrollView>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1, padding: 15, paddingTop: 30, backgroundColor: '#fff'},
	h1text: { fontSize: 30},
	header: {height: 50, backgroundColor: '#537791'},
	wrapper: {flexDirection: 'row'},
	text: {textAlign: 'center', fontWeight: '100', margin: 5},
	row: {height: 50, backgroundColor: '#E7E6E1'}
});

