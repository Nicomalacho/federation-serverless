const ApiBuilder = require('claudia-api-builder');
const { accountRepo } = require('./repositories');
const accountValidator = require('./validators/accountValidator');
const {
  NotFound, validationError, internalError,
} = require('./utils/errorHandler');
const {
  parseResponse, resolveDefaultDepositAccount, parseAccount,
} = require('./utils');

const api = new ApiBuilder();
module.exports = api;

api.get('/ping', () => ({
  message: 'Hello world',
}), {
  success: { contentType: 'application/json' },
  error: { code: 404, contentType: 'application/json; charset=UTF-8' },
});

/**
   * @apiVersion 0.1.0
   * @api {get} /federation Resolve a federated address
   * @apiName Resolve account
   * @apiGroup Account
   *
   * @apiDescription Resolve account by stellar account or federated address
   *
   * @apiParam {String} q it could be a federated address or a stellar account
   * @apiParam {String=name,id} type if its type should resolve from federated address to stellar address, id is from stellar address to federated
   *
   * @apiHeader {String} Content-Type     application/json
   * @apiHeader {String} x-api-key        api key
   *
   * @apiSuccess {String}   stellar_address    Federated address
   * @apiSuccess {String}   account_id         Stellar account id
   * @apiSuccess {String}   memo_type          account memo type
   * @apiSuccess {String}   memo               account memo
   */
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
    if (defaultDepositAccount) {
      return { default_deposit_account: defaultDepositAccount };
    }
    throw new NotFound('Account not found');
  } catch (e) {
    if (e instanceof NotFound) {
      throw new ApiBuilder.ApiResponse(e.toJson(), { 'Content-Type': 'application/json' }, 404);
    }
    throw new ApiBuilder.ApiResponse(internalError, { 'Content-Type': 'application/json' }, 500);
  }
}, {
  success: { contentType: 'application/json' },
});

/**
   * @apiVersion 0.1.0
   * @api {post} /accounts Create a stellar account
   * @apiName Create account
   * @apiGroup Account
   *
   * @apiDescription Create a federated stellar address
   *
   * @apiParam {String} domain Domain of the company used for ...*<domain>
   * @apiParam {String} identification internal identification of the user in the company used for <identification>*...
   * @apiParam {String} account_id Stellar account to be resolve against federated address
   * @apiParam {String=MEMO_ID,MEMO_TEXT} [memo_type] memo type of the stellar account
   * @apiParam {String} [memo] of the stellar account
   *
   * @apiHeader {String} Content-Type     application/json
   * @apiHeader {String} x-api-key        api key
   *
   * @apiSuccess {String}   stellar_address    Federated address
   * @apiSuccess {String}   account_id         Stellar account id
   * @apiSuccess {String}   memo_type          account memo type
   * @apiSuccess {String}   memo               account memo
   */

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
