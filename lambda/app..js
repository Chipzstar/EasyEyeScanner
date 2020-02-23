/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
		http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/*Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function*/
const environment = process.env.ENV;
const region = process.env.REGION;
const storageEasyEyeScannerStorageBucketName = process.env.STORAGE_EASYEYESCANNERSTORAGE_BUCKETNAME;
const test_key = process.env.TEST_KEY;

/* Amplify Params - DO NOT EDIT */

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

// declare a new express app
const app = express();
const router = express.Router();
router.use(bodyParser.json({ limit: '10mb' }));
router.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**********************
 * Example get method *
 **********************/

router.get('/scan', function(req, res) {
	// Add your code here
	res.json({ success: 'get call succeed!', url: req.url });
});

router.get('/scan/*', function(req, res) {
	// Add your code here
	res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
 * Example post method *
 ****************************/

router.post('/getText', async(req, res) => {
	// Add your code here
	console.log(req.body);
	let s3_params = {
		Bucket: storageEasyEyeScannerStorageBucketName,
		Key: test_key.valueOf()
	};

	await S3.getObject(s3_params, async function(err, data) {
		if (err) { // an error occurred
			let message = `Error getting object ${s3_params.Key} from bucket ${s3_params.Bucket}.`;
			console.log(message, err, err.stack);
			res.status(400).json({ "Error": message });
		}
		else {
			console.log(data.Body.toJSON());
			res.status(200).json({ "Result": "SUCCESS"});
		}
	});
});

router.post('/getText/*', function(req, res) {
	// Add your code here
	res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

router.put('/scan', function(req, res) {
	// Add your code here
	res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});

router.put('/scan/*', function(req, res) {
	// Add your code here
	res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

router.delete('/scan', function(req, res) {
	// Add your code here
	res.json({ success: 'delete call succeed!', url: req.url });
});

router.delete('/scan/*', function(req, res) {
	// Add your code here
	res.json({ success: 'delete call succeed!', url: req.url });
});

app.use('/scan', router);

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
