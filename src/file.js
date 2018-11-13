'use strict';

const bucketName = process.env.BUCKET_NAME;
const identityPoolId = process.env.IDENTITY_POOL_ID;
const awsRegion = process.env.MY_AWS_REGION;
const lkDataUrl = process.env.LK_DATA_URL;

const AWS = require('aws-sdk');

AWS.config.region = awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
});
const s3 = new AWS.S3();

module.exports.getZipFile = async (event, context) => {
    fetch(lkDataUrl).then(data => {
        const bucketParams = {
            Bucket: bucketName,
            Key: 'sample.zip',
            Body: data
        };
        s3.putObject(bucketParams, function (err, data) {
            if (err) {
                return console.log("Error", err)
            }
            return console.log("Success", data);
        });
    });
}


// const lambda = new AWS.Lambda({
//     region: awsRegion
// });
// // create JSON object for parameters for invoking Lambda function
// const pullParams = {
//     FunctionName: 'slotPull',
//     InvocationType: 'RequestResponse',
//     LogType: 'None'
// };
// // create variable to hold data returned by the Lambda function
// const pullResults;
// lambda.invoke(pullParams, function (error, data) {
//     if (error) {
//         prompt(error);
//     } else {
//         pullResults = JSON.parse(data.Payload);
//     }
// });