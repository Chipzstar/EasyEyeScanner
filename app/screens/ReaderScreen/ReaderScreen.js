import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import * as FileSystem from 'expo-file-system';
import path from 'react-native-path';
import {Auth, Storage} from 'aws-amplify';
import PDFReader from 'rn-pdf-reader-js';
import {csvParseRows} from 'd3-dsv';

//styles
import styles from "./styles";
//components
import Table from "../../components/TableComponent";

class ReaderScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			folder: "easy-eye-scanner",
			identityId: null,
			tableCollection: [],
			uri: null
		};
	}

	* enumerate(array) {
		for (let i = 0; i < array.length; i += 1) {
			yield [i, array[i]];
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
			let s3Filename = path.basename(key);
			let preSignedUrl = await Storage.get(key, {
				level: 'private',
				identityId: this.state.identityId
			});
			let uri = await this.downloadFile(preSignedUrl, s3Filename);
			await this.downloadTables(s3Dirname);
			this.setState({uri});
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

	_renderItem = ({item, index}) => {
		console.log("Table:", item);
		return (
			<Table data={item[1]} index={index} columns={item[0].length}/>
		)
	};

	render() {
		const {uri, loading, tableCollection} = this.state;
		const loadingView = (
			<View style={styles.loading}>
				<ActivityIndicator size='large'/>
			</View>
		);
		const ReaderView = <PDFReader source={{uri}}/>;
		const TableView = (
			<FlatList
				data={tableCollection}
				renderItem={this._renderItem}
				keyExtractor={(item) => String(item[0])}
			>
			</FlatList>
			/*<Table data={tableCollection[0]}/>
			<Table data={tableCollection[1]}/>
			<Table data={tableCollection[2]}/>
			<Table data={tableCollection[3]}/>*/
		);
		if (loading) return loadingView;
		else return TableView;
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
