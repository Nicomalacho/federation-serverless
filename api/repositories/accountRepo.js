const AWS = require('aws-sdk');
const moment = require('moment');
const settings = require('./settings');
const { parseAccount } = require('../utils');

const NAME = 'name';

module.exports.find = (account, type, environment) => {
  const tableName = getTableName(environment);
  const keys = parseAccount(account);
  switch (type) {
    case NAME:
      return getItemById(keys, tableName);
    default: // When type = id
      return getItemByIndex(account, tableName);
  }
};

module.exports.create = (body, environment) => {
  const tableName = getTableName(environment);
  const {
    // eslint-disable-next-line camelcase
    domain, identification, account_id, memo, memo_type,
  } = body;

  const params = {
    TableName: tableName,
    Item: {
      domain,
      identification,
      stellar_address: `${identification}*${domain}`,
      account_id,
      memo,
      memo_type,
      created_at: moment().unix(),
    },
    ReturnValues: 'ALL_OLD',
  };
  return createItem(params);
};

function getItemByIndex(index, tableName) {
  const params = {
    TableName: tableName,
    IndexName: 'account_id_index',
    KeyConditionExpression: 'account_id = :account_id',
    ExpressionAttributeValues: { ':account_id': `${index}` },
  };
  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1', convertEmptyValues: true });
  return docClient.query(params).promise();
}

function getItemById(keys, tableName) {
  const params = {
    TableName: tableName,
    Key: keys,
  };
  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1', convertEmptyValues: true });
  return docClient.get(params).promise();
}

function createItem(params) {
  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1', convertEmptyValues: true });
  return docClient.put(params).promise().then((() => params));
}

function getTableName(environment) {
  return settings(environment).federationTableName;
}
