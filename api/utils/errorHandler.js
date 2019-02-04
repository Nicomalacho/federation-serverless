
class NotFound extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotFoundError';
    this.code = 'federation.account.notFound';
    this.detail = msg;
  }

  toJson() {
    return {
      detail: this.detail,
      code: this.code,
    };
  }
}

class NotSaved extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotSavedError';
    this.code = 'federation.account.notSaved';
    this.detail = msg;
  }

  toJson() {
    return {
      detail: this.detail,
      code: this.code,
    };
  }
}
class DefaultAccountNotFound extends NotFound {
  constructor(msg) {
    super(msg);
    this.code = 'federation.defaultDepositAccount.notFound';
  }
}

const internalError = {
  detail: 'Internal error occurred',
  code: 'federation.internalError',
};

function validationError(err) {
  return {
    detail: err.name,
    code: err.errors,
  };
}

const errors = {
  NotFound,
  NotSaved,
  DefaultAccountNotFound,
  internalError,
  validationError,
};

module.exports = errors;
