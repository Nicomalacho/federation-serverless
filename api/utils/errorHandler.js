const notFound = {
  error: {
    code: 'federation.account.notFound',
    message: 'Account not found',
  },
};
const notCreated = {
  error: {
    code: 'federation.account.notCreated',
    message: 'We cannot create that account',
  },
};

const errors = {
  notFound,
  notCreated,
};

module.exports = errors;
