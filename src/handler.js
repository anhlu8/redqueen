'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const awsAccountId = process.env.AWS_ACCOUNTID;
const sqsQueueName = process.env.SQS_QUEUE_NAME;
const awsRegion = process.env.MY_AWS_REGION;

const queueUrl = `https://sqs.${awsRegion}.amazonaws.com/${awsAccountId}/${sqsQueueName}`;



module.exports.lamdaToSQS = async (event, context) => {
  console.log("event", event);
  console.log("context", context);

  const params = {
    MessageBody: "this is message sent",
    QueueUrl: queueUrl,
  };

  sqs.sendMessage(params, function (err, data) {
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
};

module.exports.sqsToLambda = async (event, context) => {
  console.log("event", event);
  console.log("context", context);

  const params = {
    WaitTimeSeconds: 5,
    QueueUrl: queueUrl,
  };

  sqs.receiveMessage(params, function (err, data) {
    event.Records.forEach(record => {
      const {
        body
      } = record;
      console.log(body);
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      })
    };
  });
};