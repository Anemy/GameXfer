import sync from 'synchronize';

import db from './Database';
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
  },

  // Needs to be in a fiber.
  getLightUserObjectForUsername: (username) => {
    const lightUser = sync.await(db.collection('users').findOne({
      username: username
    }, {
      username: 1,
      displayUsername: 1,

      posts: 1,
      xferCoin: 1
    }, sync.defer()));

    return lightUser;
  },

  // Needs to be in a fiber.
  // @returns Light forum object with data.
  getLightForumById: (forumId) => {
    const lightForum = sync.await(db.collection('forums').findOne({
      forumId: forumId
    }, {
      title: 1,
      forumId: 1
    }, sync.defer()));

    return lightForum;
  }
};