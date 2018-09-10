const ApiBuilder = require('claudia-api-builder');
const { accountRepo } = require('./repositories');
const { notFound, notCreated } = require('./utils/errorHandler');

const api = new ApiBuilder();
module.exports = api;

api.get('/ping', () => ({
  message: 'Hello world',
}), {
  success: { contentType: 'application/json' },
  error: { code: 404, contentType: 'application/json; charset=UTF-8' },
});

api.get('/federation', (request) => {
  const { environment } = request.env;
  const { q } = request.queryString;

  return accountRepo.find(q, environment)
    .then((data) => {
      if (data && data.Item) {
        return { account: data.Item };
      }
      throw notFound;
    });
}, {
  success: { contentType: 'application/json' },
  error: { code: 404, contentType: 'application/json; charset=UTF-8' },
});

api.post('/accounts', (request) => {
  const { environment } = request.env;
  const { body } = request;

  return accountRepo.create(body, environment)
    .catch(() => {
      throw notCreated;
    });
}, {
  apiKeyRequired: true,
  success: { contentType: 'application/json' },
  error: { code: 400, contentType: 'application/json; charset=UTF-8' },
});


api.addPostDeployConfig('environment', 'Environment:', 'env');
