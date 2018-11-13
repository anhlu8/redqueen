'use strict';

const bucketName = process.env.BUCKET_NAME;
const identityPoolId = process.env.IDENTITY_POOL_ID;
const awsRegion = process.env.MY_AWS_REGION;
const sqsQueueName = process.env.SQS_QUEUE_NAME;
const awsAccountId = process.env.AWS_ACCOUNTID;
const lkDataUrl = process.env.LK_DATA_URL;
const queueUrl = `https://sqs.${awsRegion}.amazonaws.com/${awsAccountId}/${sqsQueueName}`;

const AWS = require('aws-sdk');

AWS.config.region = awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
});
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

module.exports.getZipFile = async (event, context) => {
    const receivedParams = {
        WaitTimeSeconds: 5,
        QueueUrl: queueUrl,
    };
    sqs.receiveMessage(receivedParams, function (err, data) {
        event.Records.forEach(() => {
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
            }).then(() => {
                const sentParams = {
                    MessageBody: "this is message sent",
                    QueueUrl: queueUrl,
                };
                sqs.sendMessage(sentParams, function (err, data) {
                    if (err) {
                        console.log('error:', 'Fail send message' + err);
                    } else {
                        console.log('data:', data.MessageId);
                        return {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Go Serverless v1.0! Your function executed successfully!',
                                input: event,
                            }),
                        };
                    }
                });
            });
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            })
        };
    })
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