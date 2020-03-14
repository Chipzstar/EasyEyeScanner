import {API} from 'aws-amplify';
import React from 'react';
import awsmobile from "../../aws-exports";

export default function TextIdentification() {
	console.log('Function entered...');
	let apiName = awsmobile.aws_cloud_logic_custom[0].name;
	let path = '/scan/getText';
	let myInit = { // OPTIONAL
		body: {
			key: "private/eu-west-2:1bbd817b-6d01-4f56-b903-0ea8a7598256/05-03-2020/15:00:00/Billing Management Console.txt"
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
