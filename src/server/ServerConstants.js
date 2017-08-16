// Constants used by the server.

// We export it this way so we can pull certain aspects of the constants in files.
module.exports = {
  TEST_MONGODB_URL: 'mongodb://localhost:27017/gamexfer_test',
  PROD_MONGODB_URL: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:27020/gamexfer`,

  S3_BUCKET: 'gamexfer',

  SIGNUP_HASH: 1,
  LOGIN_HASH: 2
};