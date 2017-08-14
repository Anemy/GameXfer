// Handle the request to view the tracker page.
import _ from 'underscore';
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  sync.fiber(() => {
    let user = sync.await(db.collection('users').findOne({
      username: req.session.username
    }, {
      username: 1,
      displayUsername: 1,
      posts: 1,
      xferCoin: 1,
      avatarURL: 1,
      trackedThreads: 1,
      hasUnread: 1
    }, sync.defer()));

    if (!user) {
      res.status(400).send({
        err: 'Cannot find your user. This could be an issue, please contact us.'
      });
      return;
    }

    let threadQuery = {};

    _.each(user.trackedThreads, (trackedThread) => {
      if (!threadQuery._id) {
        threadQuery._id = {
          $in: []
        };
      }

      if (trackedThread.uniqueThreadId) {
        threadQuery._id.$in.push(trackedThread.uniqueThreadId);
      }
    });

    // Find the threads for that forum.
    let threads = sync.await(db.collection('threads').find(threadQuery, {
      threadId: 1,
      forumId: 1,
      title: 1,
      description: 1,
      views: 1,
      type: 1,
      author: 1,
      createdAt: 1,
      mostRecentCommentTime: 1,
      mostRecentCommentAuthor: 1,
      mostRecentCommentId: 1,
      commentsLength: 1
    }).sort({
      mostRecentCommentTime: -1
    })
      // Shouldn't ever be used but training wheels keep the bike from falling.
      .limit(Constants.MAX_TRACKED_LENGTH).toArray(sync.defer()));

    // TODO: Make these lookups run in parallel.
    _.each(threads, (thread) => {
      if (thread && thread.mostRecentCommentAuthor) {
        thread.mostRecentCommentAuthor = ServerUtils.getLightUserForUsername(thread.mostRecentCommentAuthor);
      }
      if (thread && thread.author) {
        thread.author = ServerUtils.getLightUserForUsername(thread.author);
      }
    });

    res.render('tracker', {
      threads: threads,
      user: user
    });
  });
};