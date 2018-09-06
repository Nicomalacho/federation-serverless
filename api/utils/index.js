const _ = require('lodash');

module.exports.parseAccount = (account) => {
  const arr = _.split(account, '*', 2);
  return { domain: arr[1], identification: arr[0] };
};
