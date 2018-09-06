module.exports = (environment) => {
  let env = environment;
  if (env === 'production') {
    env = 'prod';
  }

  if (env === 'development' || !env || env === 'undefined') {
    env = 'dev';
  }

  return {
    federationTableName: `federation-server-${env}`,
  };
};
