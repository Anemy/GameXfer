import Environment from '../shared/Environment';
import ServerConstants from './ServerConstants';

export default {
  getMongoDBURL: () => {
    if (Environment.isDev()) {
      return ServerConstants.TEST_MONGODB_URL;
    } else if (process.env.GAMEXFER_MONGO_URL) {
      return process.env.GAMEXFER_MONGO_URL;
    } else {
      return ServerConstants.TEST_MONGODB_URL;
    }
  }
};