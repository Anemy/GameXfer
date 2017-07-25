const ServerConstants = {
  TEST_MONGODB_URL: 'mongodb://localhost:27017/gamexfer_test',

  SIGNUP_HASH: 1,
  LOGIN_HASH: 2
};

// We export it this way so we can partially pull aspects of the constants in files.
module.exports = ServerConstants;