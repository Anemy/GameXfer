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
  const forumId = req.params.forumId;
  const requestedForumPage = req.params.forumPage; // Optional.
  const requestedThreadType = req.query ? req.query['thread-type'] : null; // Optional.

  // Ensure the request has the proper attributes.
  if (forumId === undefined) {
    res.status(400).send({
      err: 'Invalid forum get. Please specify a forumId.'
    });
    return;
  }

  let forumPage = 0;
  if (requestedForumPage && Utils.isNumber(requestedForumPage)) {
    forumPage = Number(requestedForumPage)-1 /* Subtract 1 so the forum is 0 indexed. */;
  }

  if (requestedThreadType && !Utils.validThreadType(requestedThreadType)) {
    res.status(400).send({
      err: 'Invalid thread type. Please specify a valid thread-type.'
    });
    return;
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

    let forumSearch = {
      forumId: forumId
    };

    if (requestedThreadType) {
      forumSearch.type = requestedThreadType;
    }

    // Find the threads for that forum.
    let threads = sync.await(db.collection('threads').find(forumSearch, {
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
      // Get the Constants.THREADS_PER_PAGE threads based on the page number.
      .skip(forumPage * Constants.THREADS_PER_PAGE)
      .limit(Constants.THREADS_PER_PAGE).toArray(sync.defer()));

    // TODO: Make these lookups run in parallel.
    _.each(threads, (thread) => {
      if (thread && thread.mostRecentCommentAuthor) {
        thread.mostRecentCommentAuthor = ServerUtils.getLightUserForUsername(thread.mostRecentCommentAuthor);
      }
      if (thread && thread.author) {
        thread.author = ServerUtils.getLightUserForUsername(thread.author);
      }
    });

    res.status(200);
    res.render('forum', {
      typeView: requestedThreadType ? requestedThreadType : 'all',
      THREAD_TYPES: Constants.THREAD_TYPES,
      THREADS_PER_PAGE: Constants.THREADS_PER_PAGE,
      forumPage: forumPage + 1 /* Add one so it's no longer 0 indexed. */,
      forum: forum,
      threads: threads,
      user: req.session.username ? ServerUtils.getLightUserForUsername(req.session.username) : null
    });
  });
};

