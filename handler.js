"use strict";

var AWS = require("aws-sdk");
var s3 = new AWS.S3();

module.exports.upload = (event, context, callback) => {
  var params = JSON.parse(event.body);

  var s3Params = {
    Bucket: "tyc00n-sls-upload",
    Key: params.name,
    ContentType: params.type,
    ACL: "public-read"
  };
  var uploadURL = s3.getSignedUrl("putObject", s3Params);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": event.headers.origin || "*"
    },
    body: JSON.stringify({ uploadURL: uploadURL })
  };

  callback(null, response);
};
