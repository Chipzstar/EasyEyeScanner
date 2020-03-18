import {API} from 'aws-amplify';
import React from 'react';
import awsmobile from "../../aws-exports";

export default function TextIdentification() {
	console.log('Function entered...');
	let apiName = awsmobile.aws_cloud_logic_custom[0].name;
	let path = '/scan/getText';
	let myInit = { // OPTIONAL
		body: {

		}, // replace this with attributes you need
		headers: {
			'Content-Type': "application/json",
			'Accept': "application/json"
		},
		response: true// OPTIONAL
	};
	console.log('Making Api request...');
	API.post(apiName, path, myInit).then(res => console.log(res.data)).catch(err => console.error(err));
};
