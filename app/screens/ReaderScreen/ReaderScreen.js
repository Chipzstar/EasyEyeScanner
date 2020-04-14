import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import * as FileSystem from 'expo-file-system';
import path from 'react-native-path';
import {Auth, Storage} from 'aws-amplify';
import {csvParseRows} from 'd3-dsv';
import {Container, Title, Header, Left, Body, Right, Button, Icon} from "native-base";

//styles
import styles from "./styles";
//components
import Table from "../../components/TableComponent";
import Form from "../../components/FormComponent";
import PopUpMenu from "../../components/PopUpMenu";
import SpeechComponent from "../../components/SpeechComponent";

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

	mainView = () => {
		this.setState({isFormView: false, isTableView: false})
	};

	async downloadForms(s3_prefix) {
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
			await FileSystem.makeDirectoryAsync(dir, {intermediates: true});
			let fileUri = `${dir}/${file}`;
			await FileSystem.downloadAsync(url, fileUri);
			await FileSystem.getInfoAsync(fileUri);
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
			console.log(content);
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
			<Table data={item[1]} index={index} hideTables={this.mainView.bind(this)}/>
		)
	};

	onPopupEvent = (eventName, index) => {
		if (eventName !== 'itemSelected') return;
		switch (index) {
			case 0:
				this.setState({isTableView: true, isFormView: false});
				break;
			case 1:
				this.setState({isTableView: false, isFormView: true});
				break;
			default:
				this.setState({isTableView: false, isFormView: false})
		}
	};

	render() {
		const {navigation} = this.props;
		const {loading, textractData, tableCollection, formCollection, isTableView, isFormView} = this.state;
		const loadingView = (
			<View style={styles.loading}>
				<ActivityIndicator size='large'/>
			</View>
		);
		const ReaderView = (
			<Container style={styles.container}>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => navigation.goBack()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body style={{flex:1,alignItems:'center'}}>
						<Title>Reader</Title>
					</Body>
					<Right style={{flex: 1}}>
						<PopUpMenu actions={['View Tables', 'View Forms']} color={'white'} onPress={this.onPopupEvent}/>
					</Right>
				</Header>
				<SpeechComponent data={textractData}/>
			</Container>
		);
		const FormView = (
			<Form data={formCollection[0]} hideForm={this.mainView.bind(this)}/>
		);
		const TableView = (
			<Container style={styles.container}>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.mainView()}>
							<Icon name="arrow-back"/>
						</Button>
					</Left>
					<Body style={{flex:1,alignItems:'center'}}>
						<Title>Tables</Title>
					</Body>
					<Right style={{flex: 1}}>
						<PopUpMenu actions={['View Tables', 'View Forms']} onPress={this.onPopupEvent}/>
					</Right>
				</Header>
				{tableCollection ?
					<FlatList
						data={tableCollection}
						renderItem={this._renderTable}
						keyExtractor={(item) => String(item[0])}
					>
					</FlatList> : <Text style={styles.infoText}>There are no tables for this document!</Text>
				}
			</Container>
		);
		const MainView = (
			<Container>
				{isTableView
					? TableView
					: (isFormView
							? FormView
							: ReaderView
					)
				}
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
