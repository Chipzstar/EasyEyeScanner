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
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_KEY;

/* Amplify Params - DO NOT EDIT */

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({
	apiVersion: '2006-03-01',
	region: region,
	accessKeyId: accessKey,
	secretAccessKey: secretKey
});
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const fs = require('fs');
const shorthash = require('shorthash');

const PAGE_SIZES = {
	"A4": [595.28, 841.89],
	"Letter": [612.00, 792.00],
	"Legal": [612.00, 1008.00],
};


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

function listImages(key) {
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: storageEasyEyeScannerStorageBucketName,
			Prefix: key
		};
		let listObjectPromise = S3.listObjects(params).promise();
		listObjectPromise.then(data => {
			let objects = data['Contents'];
			resolve(objects);
		}).catch(err => {
			console.error(err);
			reject({ message: 'Error finding the bucket content', error: err });
		});
	});
}

function getImages(objects) {
	return new Promise((resolve, reject) => {
		let pendingStepCount = objects.length;

		const stepFinished = () => {
			console.log(`pending step count: ${pendingStepCount}`);
			if (--pendingStepCount == 0) {
				resolve(b64Images);
			}
		};

		let b64Images = objects.map(obj => {
			let key = obj['Key'].valueOf();
			const destPath = `/tmp/${shorthash.unique(key).concat(".", key.split('.')[1])}`;
			let s3Stream = S3.getObject({
				Bucket: storageEasyEyeScannerStorageBucketName,
				Key: key
			}).createReadStream();
			s3Stream
				.on('error', (err) => reject({ "type": "s3Stream", err }))
				.on('finish', () => console.log("finished reading from S3"))
				.on('close', () => console.log("s3Stream closed"));
			let fileStream = fs.createWriteStream(destPath);
			fileStream
				.on('error', (err) => reject({ "type": "fileStream", err }))
				.on('ready', () => {
					s3Stream.pipe(fileStream);
					console.log(`writing ${key} to ${destPath}`);
				})
				.on('close', () => {
					console.log(`finished writing ${key} to ${destPath}`);
					stepFinished();
				});
			return destPath;
		});
	});
}

function savePdfToFile(images, fileName) {
	const pdf = new PDFDocument({ autoFirstPage: false, size: PAGE_SIZES.A4 });
	for (let IMG of images) {
		console.log(IMG);
		pdf.addPage().image(IMG, 0, 0, { fit: PAGE_SIZES.A4, align: 'center', valign: 'center' });
	}
	return new Promise((resolve, reject) => {

		// To determine when the PDF has finished being written successfully
		// we need to confirm the following 2 conditions:
		//
		//   1. The write stream has been closed
		//   2. PDFDocument.end() was called syncronously without an error being thrown

		let pendingStepCount = 2;

		const stepFinished = () => {
			console.log(`pending step count: ${pendingStepCount}`);
			if (--pendingStepCount == 0) {
				resolve(pdf);
			}
		};

		const writeStream = fs.createWriteStream(fileName);
		writeStream.on('close', stepFinished);
		pdf.pipe(writeStream);

		pdf.end();

		stepFinished();
	});
}

function uploadToS3(fileName, pdfName) {
	let data = fs.readFileSync(fileName);
	console.log(data);
	let s3_params = {
		Body: data,
		Bucket: storageEasyEyeScannerStorageBucketName,
		ContentType: 'application/pdf',
		Key: `${test_key}/${pdfName}.pdf`,
		contentDisposition: 'inline',
		ACL: 'private',
		ServerSideEncryption: "AES256"
	};
	return new Promise((resolve, reject) => {
		S3.upload(s3_params, async function(err, data) {
			console.log("attempting upload...");
			if (err) {
				console.log(err, err.stack);
				reject(err);
			}
			else {
				console.log(data);
				resolve({"Message": "UPLOAD SUCCESS", "PDF Location": data.Location, "S3BucketKey": data.Key});
			}
		});
	});
}


/****************************
 * Example post method *
 ****************************/

router.post('/convertPDF', async function(req, res) {
	let filePath = "/tmp/pdfgen.pdf";
	try {
		let objects = await listImages(test_key);
		let imageFiles = await getImages(objects);
		await savePdfToFile(imageFiles, filePath);
		let response = await uploadToS3(filePath, req.body.filename);
		res.status(200).json({"Result": response});
	}
	catch (err) {
		console.error(err);
		res.status(400).json({ "ERROR": JSON.parse(JSON.stringify(err)) });
	}
});

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
			res.status(200).json({ "Result": "SUCCESS" });
		}
	});
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
