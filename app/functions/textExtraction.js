import Predictions from '@aws-amplify/predictions';
import {Storage} from 'aws-amplify';
import React from 'react';

export default function TextIdentification() {
	console.log('Function entered...');
	const testIdentityID = "eu-west-2:1bbd817b-6d01-4f56-b903-0ea8a7598256";
	const testKey = '1ayTEF.jpg';
	Storage.get(testKey, {download: false, identityId: testIdentityID})
		.then(file => {
			console.log(`File obtained: ${file}`);
			Predictions.identify({
				text: {
					source: {
						identityId: testIdentityID,
						key: testKey,
						level: 'public'
					},
					format: "PLAIN", // Available options "PLAIN", "FORM", "TABLE", "ALL"
				}
			}).then(({text: {fullText}}) => {
				console.log(`\nFULL TEXT:\n\n${fullText}`);
			}).catch(err => console.error(JSON.stringify(err, null, 2)))
		})
		.catch(err => console.log(err));
};
