const AWS = require('aws-sdk');
const Promise = require('bluebird');
const moment = require('moment');
const settings = require('./settings');
const { parseAccount } = require('../utils');

module.exports.find = (account, environment) => {
  const keys = parseAccount(account);
  const tableName = getTableName(environment);
  const params = {
    TableName: tableName,
    Key: keys,
  };

  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1', convertEmptyValues: true });
  return docClient.get(params).promise();
};

module.exports.create = (body, environment) => {
  const tableName = getTableName(environment);
  const { domain, identification, accountId } = body;
  const params = {
    TableName: tableName,
    Item: {
      domain,
      identification,
      accountId,
      createdAt: moment().unix(),
    },
  };

  return Promise.promisify(createItem)(params);
};

function createItem(params, callback) {
  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1', convertEmptyValues: true });
  docClient.put(params, (err) => {
    if (err) {
      callback('we could not create your account, please try again later');
    } else {
      callback(null, { account: params.Item });
    }
  });
}


function getTableName(environment) {
  return settings(environment).federationTableName;
}
