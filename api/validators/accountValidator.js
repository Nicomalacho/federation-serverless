const yup = require('yup');

const regexDomain = /([a-zA-Z0-9]([a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/;

const schema = yup.object().shape({
  domain: yup.string().matches(regexDomain).required(),
  identification: yup.string().required(),
  accountId: yup.string().required(),
});

module.exports.validate = function validate(data) {
  return schema.validate(data, { abortEarly: false });
};
