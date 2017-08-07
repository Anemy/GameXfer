// Sends the user a page with a forum's information and all of its threads.

// TODO: Cache queries.

import _ from 'underscore';
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Forums from '../../../shared/Forums';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  let forumId = req.params.forumId;
  let forumPage = req.params.forumPage; // Optional.

  // Ensure the request has the proper attributes.
  if (forumId === undefined) {
    res.status(400).send({
      err: 'Invalid forum get. Please specify a forumId.'
    });
    return;
  }

  if (Utils.isNumber(forumId)) {
    forumId = Number(forumId);
  }

  if (forumPage && Utils.isNumber(forumPage)) {
    forumPage = Number(forumPage);
  } else {
    forumPage = 0;
  }

  sync.fiber(() => {
    // Retrieve the requested forum.
    let forum = sync.await(db.collection('forums').findOne({
      forumId: forumId
    }, {
      forumId: 1,
      threadsCreatedTotal: 1
    }, sync.defer()));

    if (!forum) { 
      res.status(400).send({
        err: 'Unable to find forum.'
      });
      return;
    }

    const forumInfo = Forums.getForumInfoById(forumId);
    // Copy all of the data about the forum onto our locally pulled one.
    _.extend(forum, forumInfo);

    // Find the threads for that forum.
    let threads = sync.await(db.collection('threads').find({
      forumId: forumId
    }, {
      threadId: 1,
      forumId: 1,
      title: 1,
      description: 1,
      views: 1,
      author: 1,
      createdAt: 1,
      mostRecentCommentTime: 1,
      mostRecentCommentAuthor: 1,
      mostRecentCommentId: 1,
      commentsLength: 1
    }).sort({
      mostRecentCommentTime: 1
    })
      // Get the Constants.AMOUNT_OF_THREADS_PER_PAGE threads based on the page number.
      .skip(forumPage * Constants.AMOUNT_OF_THREADS_PER_PAGE)
      .limit(Constants.AMOUNT_OF_THREADS_PER_PAGE).toArray(sync.defer()));

    _.each(threads, (thread) => {
      if (thread && thread.mostRecentCommentAuthor) {
        thread.mostRecentCommentAuthor = ServerUtils.getLightUserObjectForUsername(thread.mostRecentCommentAuthor);
      }
      if (thread && thread.author) {
        thread.author = ServerUtils.getLightUserObjectForUsername(thread.author);
      }
    });

    res.status(200);
    res.render('forum', {
      forum: forum,
      threads: threads,
      user: req.session.username ? ServerUtils.getLightUserObjectForUsername(req.session.username) : null
    });
  });
};

