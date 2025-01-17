import {Auth, API} from 'aws-amplify';
import React from 'react';
import awsmobile from "../../aws-exports";

export default async function GeneratePDF(pdfName) {
	try {
		let identityID = (await Auth.currentCredentials()).identityId; //This will give unauthenticated credentials object
		console.log("identityID:", identityID);
		console.log("pdfName:", pdfName);
		let apiName = awsmobile.aws_cloud_logic_custom[0].name;
		let path = '/scan/convertPDF';
		let myInit = { // OPTIONAL
			body: {
				"id": identityID,
				"documentPath": pdfName,
			}, // replace this with attributes you need
			headers: {
				'Content-Type': "application/json",
				'Accept': "application/json"
			},
			response: true// OPTIONAL
		};
		console.log('Making Api request...');
		let result = await API.post(apiName, path, myInit);
		return result.data;
	} catch (err) {
		console.error(err);
	}
}
