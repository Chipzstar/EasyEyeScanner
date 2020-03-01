import {Auth, API} from 'aws-amplify';
import React from 'react';
import awsmobile from "../../aws-exports";

export default function GeneratePDF(pdfName) {
	Auth.currentCredentials().then(creds => { //This will give unauthenticated credentials object
		let identityID = creds.identityId;
		console.log("identityID", identityID);
		console.log("pdf name", pdfName);
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
		API.post(apiName, path, myInit).then(res => console.log(res.data)).catch(err => console.error(err));
	}).catch(err => console.error(err));
}
