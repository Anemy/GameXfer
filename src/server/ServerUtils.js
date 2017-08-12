import _ from 'underscore';
import sync from 'synchronize';
import xss from 'xss';

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
  getLightUserForUsername: (username, options) => {
    let fields = {
      username: 1,
      displayUsername: 1,

      posts: 1,
      xferCoin: 1,

      hasUnread: 1,
      avatarURL: 1
    };

    _.extend(fields, options);

    const lightUser = sync.await(db.collection('users').findOne({
      username: username
    }, fields, sync.defer()));

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
  },

  // Needs to be in a fiber.
  // @returns Light forum object with data.
  getLightThreadById: (forumId, threadId) => {
    const lightThread = sync.await(db.collection('threads').findOne({
      forumId: forumId,
      threadId: threadId
    }, {
      threadId: 1,
      forumId: 1,
      title: 1,
      description: 1
    }, sync.defer()));

    return lightThread;
  },

  // Converts the passed text to html and prevents against xss.
  sanitizeAndMarkdown: (text) => {
    const sanitizedText = xss(text);

    return sanitizedText;
  }
};