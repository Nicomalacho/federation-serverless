const ApiBuilder = require('claudia-api-builder');
const { accountRepo } = require('./repositories');
const accountValidator = require('./validators/accountValidator');
const {
  NotFound, validationError, internalError, DefaultAccountNotFound
} = require('./utils/errorHandler');
const { 
  parseResponse, resolveDefaultDepositAccount, parseAccount 
} = require('./utils');

const api = new ApiBuilder();
module.exports = api;

api.get('/ping', () => ({
  message: 'Hello world',
}), {
  success: { contentType: 'application/json' },
  error: { code: 404, contentType: 'application/json; charset=UTF-8' },
});

api.get('/federation', async (request) => {
  const { environment } = request.env;
  const { q, type } = request.queryString;
  const keys = parseAccount(q);
  try {
    const data = await accountRepo.find(q, type, environment);
    if (data.Item || data.Items) {
      return parseResponse(data);
    }
    const defaultDepositAccount = await resolveDefaultDepositAccount(keys.domain);
    if(defaultDepositAccount){
      return {defaultDepositAccount};
    }
    throw new DefaultAccountNotFound('Default federation deposit account not found');            
  } catch (e) {
    if (e instanceof NotFound) {
      throw new ApiBuilder.ApiResponse(e.toJson(), { 'Content-Type': 'application/json' }, 404);
    }
    throw new ApiBuilder.ApiResponse(internalError, { 'Content-Type': 'application/json' }, 500);
  }
}, {
  success: { contentType: 'application/json' },
});

api.post('/accounts', async (request) => {
  const { environment } = request.env;
  const { body } = request;

  try {
    await accountValidator.validate(body);
  } catch (e) {
    throw new ApiBuilder.ApiResponse(validationError(e), { 'Content-Type': 'application/json' }, 404);
  }

  return accountRepo.create(body, environment)
    .then(data => parseResponse(data)).catch((err) => {
      throw new ApiBuilder.ApiResponse(err, { 'Content-Type': 'application/json' }, 500);
    });
}, {
  apiKeyRequired: true,
  success: { contentType: 'application/json' },
});

api.addPostDeployConfig('environment', 'Environment:', 'env');
