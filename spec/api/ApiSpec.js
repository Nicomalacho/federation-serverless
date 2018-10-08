const AWS = require('aws-sdk');
const _ = require('lodash');
const api = require('../../api');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'space-center' });

describe('When ping is called', () => {
  let lambdaContextSpy;
  let defaultParams;

  beforeEach(() => {
    lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
    defaultParams = {
      headers: { 'content-type': 'application/json' },
      requestContext: { httpMethod: 'GET', resourcePath: '/ping' },
      stageVariables: { environment: 'dev' },
    };
  });

  it('should return success', (done) => {
    api.proxyRouter(defaultParams, lambdaContextSpy)
      .then(() => {
        const joc = jasmine.objectContaining;
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, joc({
          statusCode: 200,
          body: '{"message":"Hello world"}',
        }));
      })
      .then(done, done.fail);
  });
});

describe('when query an account', () => {
  let lambdaContextSpy;
  let defaultParams;

  beforeEach(() => {
    lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
    defaultParams = {
      headers: { 'content-type': 'application/json' },
      requestContext: { httpMethod: 'GET', resourcePath: '/federation' },
      stageVariables: { environment: 'dev' },
    };
  });

  it('should return a valid account with type', (done) => {
    const queryParameters = {
      q: '3155964774*ariari.co',
      type: 'name',
    };
    api.proxyRouter(_.merge(defaultParams, {
      queryStringParameters: queryParameters,
    }), lambdaContextSpy)
      .then(() => {
        const joc = jasmine.objectContaining;
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, joc({
          statusCode: 200,
        }));
      })
      .then(done, done.fail);
  });

  it('should not found an account', (done) => {
    const queryParameters = {
      q: '3103124321*nico.co',
      type: 'name',
    };
    api.proxyRouter(_.merge(defaultParams, {
      queryStringParameters: queryParameters,
    }), lambdaContextSpy)
      .then(() => {
        const joc = jasmine.objectContaining;
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, joc({ statusCode: 404 }));
      })
      .then(done, done.fail);
  });
});
