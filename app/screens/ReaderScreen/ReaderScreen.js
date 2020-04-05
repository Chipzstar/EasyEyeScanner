import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import * as FileSystem from 'expo-file-system';
import path from 'react-native-path';
import {Auth, Storage} from 'aws-amplify';
import PDFReader from 'rn-pdf-reader-js';
import {csvParseRows} from 'd3-dsv';
import { Container, Segment, Header, Left, Body, Right, Button, Icon, Content } from "native-base";

//styles
import styles from "./styles";
//components
import Table from "../../components/TableComponent";
import Form from "../../components/FormComponent";

class ReaderScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			folder: "easy-eye-scanner",
			identityId: null,
			textractData: "",
			tableCollection: [],
			formCollection: [],
			uri: null,
			isTableView: false,
			isFormView: false
		};
	}

	* enumerate(array) {
		for (let i = 0; i < array.length; i += 1) {
			yield [i, array[i]];
		}
	}

	async downloadForms(s3_prefix){
		try {
			console.log("Prefix:", s3_prefix);
			let forms = await Storage.list(`${s3_prefix}/forms`, {
				level: 'private',
				identityId: this.state.identityId
			});
			if (forms) {
				for (let formObj of this.enumerate(forms)) {
					console.log("Form Object", formObj);
					//let index = formObj[0];
					let key = formObj[1].key;
					let formDataURL = await Storage.get(key, {
						level: 'private',
						identityId: this.state.identityId
					});
					let fileUri = await this.downloadFile(formDataURL, path.basename(key));
					let content = await FileSystem.readAsStringAsync(fileUri);
					let formData = JSON.parse(content);
					this.setState({formCollection: [...this.state.formCollection, formData]});
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	async downloadTables(s3_prefix) {
		try {
			console.log("Prefix:", s3_prefix);
			let tables = await Storage.list(`${s3_prefix}/tables`, {
				level: 'private',
				identityId: this.state.identityId
			});
			if (tables) {
				for (let tableObj of this.enumerate(tables)) {
					console.log("Table Object", tableObj);
					let index = tableObj[0];
					let key = tableObj[1].key;
					let tableDataURL = await Storage.get(key, {
						level: 'private',
						identityId: this.state.identityId
					});
					let fileUri = await this.downloadFile(tableDataURL, path.basename(key));
					let content = await FileSystem.readAsStringAsync(fileUri);
					let tableData = await csvParseRows(content);
					this.setState({tableCollection: [...this.state.tableCollection, [index, tableData]]});
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	async downloadFile(url, file) {
		try {
			let dir = `${FileSystem.documentDirectory}${this.state.folder}`;
			//console.log("dirname: ", dir);
			await FileSystem.makeDirectoryAsync(dir, {intermediates: true});
			let fileUri = `${dir}/${file}`;
			//console.log("fileUri: ", fileUri);
			let response = await FileSystem.downloadAsync(url, fileUri);
			//console.log(response);
			let fileInfo = await FileSystem.getInfoAsync(fileUri);
			//console.log(fileInfo);
			return fileUri;
		} catch (e) {
			console.error(e);
		}
	}

	async componentDidMount() {
		try {
			this.showLoading();
			this.setState({identityId: (await Auth.currentCredentials()).identityId});
			let key = this.props.documents[this.props.navigation.getParam('documentID')]['S3BucketKey'].replace(`private/${this.state.identityId}/`, "");
			let s3Dirname = path.dirname(key);
			let s3Filename = path.basename(key, 'pdf');
			let preSignedUrl = await Storage.get(`${s3Dirname}/${s3Filename}.txt`, {
				level: 'private',
				identityId: this.state.identityId
			});
			let uri = await this.downloadFile(preSignedUrl, `${s3Filename}.txt`);
			let content = await FileSystem.readAsStringAsync(uri);
			this.setState({textractData: content});
			await this.downloadTables(s3Dirname);
			await this.downloadForms(s3Dirname);
			this.hideLoading();
		} catch (e) {
			throw e;
		}
	}

	showLoading() {
		this.setState({loading: true})
	}

	hideLoading() {
		this.setState({loading: false})
	}

	_renderTable = ({item, index}) => {
		console.log("Table:", item);
		return (
			<Table data={item[1]} index={index} columns={item[0].length}/>
		)
	};

	/*_renderForm = ({item, index}) => {
		console.log("Form:", item);
		return (
			<Form data={item} index={index}/>
		)
	};*/

	render() {
		const { navigation } = this.props;
		const {loading, textractData, tableCollection, formCollection, isTableView, isFormView} = this.state;
		const loadingView = (
			<View style={styles.loading}>
				<ActivityIndicator size='large'/>
			</View>
		);
		const ReaderView = (
			<Text>{textractData}</Text>
		);
		const FormView = (
			<Form data={formCollection[0]}/>
			/*<FlatList
				data={formCollection}
				renderItem={this._renderForm}
				keyExtractor={(item) => formCollection.indexOf(item).toString()}
			>
			</FlatList>*/
		);
		const TableView = (
			<FlatList
				data={tableCollection}
				renderItem={this._renderTable}
				keyExtractor={(item) => String(item[0])}
			>
			</FlatList>
		);
		const MainView = (
			<Container>
				<View>
					{isTableView
						? TableView
						: (isFormView
								? FormView
								: ReaderView
						)
					}
				</View>
			</Container>
		);
		if (loading) return loadingView;
		else return MainView;
	}
}

const mapStateToProps = (state) => {
	return {
		documents: state.documents.documents
	}
};

// `connect` returns a new function that accepts the component to wrap:
const connectToStore = connect(
	mapStateToProps
);

const reduxReaderScreen = connectToStore(ReaderScreen);

export default reduxReaderScreen;
