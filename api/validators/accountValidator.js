const yup = require('yup');

const MEMO_TEXT = 'MEMO_TEXT';
const MEMO_ID = 'MEMO_ID';
const MEMO_HASH = 'MEMO_HASH';
const MEMO_RETURN = 'MEMO_RETURN';
const regexDomain = /([a-zA-Z0-9]([a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/;

const object = yup.object({
  domain: yup.string().matches(regexDomain).required(),
  identification: yup.string().required(),
  account_id: yup.string().required(),
  memo_type: yup.string().required(),
});

module.exports.validate = function validate(data) {
  const schema = addKey(data.memo_type ? data.memo_type : '');
  return schema.validate(data, { strict: true });
};

function addKey(key) {
  switch (key) {
    case MEMO_TEXT:
      return object.shape({
        memo: yup.string().max(28).required(),
      });
    case MEMO_ID:
      return object.shape({
        memo: yup.number().integer().positive().required(),
      });
    case MEMO_HASH:
      return object.shape({
        memo: yup.string().max(32).required(),
      });
    case MEMO_RETURN:
      return object.shape({
        memo: yup.string().max(32).required(),
      });
    default:
      return object;
  }
}
