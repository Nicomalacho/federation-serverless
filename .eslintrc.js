module.exports = {
  'extends': 'airbnb-base',
  'plugins': [
    'jasmine'
  ],
  env: {
    browser: false,
    node: true,
    es6: false,
    jasmine: true,
  },
  rules: {
    'max-len': ['error', { 'code': 100, 'ignoreStrings': true, 'ignoreComments': true }],
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
  }
};
