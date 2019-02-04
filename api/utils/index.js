const StellarSdk = require('stellar-sdk');
const _ = require('lodash');

module.exports.parseAccount = (account) => {
  const arr = _.split(account, '*', 2);
  return { domain: arr[1], identification: arr[0] };
};

module.exports.parseResponse = (data) => {
  let obj = {};
  if (data.Items && data.Items.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    obj = data.Items[0];
  } else if (data.Item) {
    obj = data.Item;
  } else if (data.Attributes) {
    obj = data.Attributes;
  }

  return {
    stellear_address: obj.stellar_address,
    account_id: obj.account_id,
    memo_type: obj.memo_type,
    memo: obj.memo,
  };
};

module.exports.resolveDefaultDepositAccount = async (domain) => {
  try {
    const tomlInfo = await StellarSdk.StellarTomlResolver.resolve(domain);
    const defaultDepositAccount = tomlInfo.FEDERATION_DEFAULT_DEPOSIT_ACCOUNT;
    return defaultDepositAccount; 
  } catch (e){
    return false;
  } 
}

