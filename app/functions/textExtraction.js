import {API} from 'aws-amplify';
import React from 'react';
import awsmobile from "../../aws-exports";

export default async function TextIdentification() {
	try {
		console.log('Function entered...');
		let apiName = awsmobile.aws_cloud_logic_custom[0].name;
		let path = '/scan/getText';
		let myInit = { // OPTIONAL
			body: {}, // replace this with attributes you need
			headers: {
				'Content-Type': "application/json",
				'Accept': "application/json"
			},
			response: true// OPTIONAL
		};
		console.log('Making Api request...');
		let result = await API.post(apiName, path, myInit);
		return result.data;
	} catch (err){
		console.error(err);
		throw err;
	}
};
