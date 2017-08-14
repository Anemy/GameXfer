// Searches for threads which match the queries and returns the html.

// TODO: Cache queries.

import _ from 'underscore';
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Forums from '../../../shared/Forums';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  // Ensure the request has the proper attributes.
  if (!req.query || req.query.length === 0) {
    res.status(400).send({
      err: 'Invalid search. Please specify some search parameters.'
    });
    return;
  }

  // All of these parameters are optional, but there at least has to be one supplied ^.
  const author = req.query['author'];
  const requestedPage = req.query['page'];
  const forumId = req.query['forumId'];
  const threadType = req.query['thread-type'];
  // const text = req.query['text']; // Search titles and descriptions.

  let searchPage = 0;
  if (requestedPage && Utils.isNumber(requestedPage)) {
    searchPage = Number(requestedPage)-1 /* Subtract 1 so the search is 0 indexed. */;
  }

  sync.fiber(() => {
    // Search for threads that match the query.
    let query = {};
    // Only perform queries when they are doing something useful.
    let validQuery = false;

    let authorUser;
    if (author) {
      // We index our authors lowercase username.
      const authorToSearchFor = author.toLowerCase();

      // Ensure the user exists before we look for their threads.
      authorUser = sync.await(db.collection('users').findOne({
        username: authorToSearchFor
      }, {
        username: 1,
        displayUsername: 1
      }, sync.defer()));

      if (!authorUser) {
        res.status(400).send({
          err: 'That user was not found. Did you spell their username correctly?'
        });
        return;
      }

      query.author = authorToSearchFor;
      validQuery = true;
    }

    if (threadType) {
      if (threadType && !Utils.validThreadType(threadType)) {
        res.status(400).send({
          err: 'Invalid thread type. Please specify a valid thread-type.'
        });
        return;
      }

      query.type = threadType;
    }

    if (forumId) {
      // Ensure that forum exists.
      if (!Forums.getForumInfoById(forumId)) {
        res.status(400).send({
          err: 'Invalid forum id. Please specify a valid forum id.'
        });
        return;
      }

      query.forumId = forumId;
    }

    // Find the threads for that forum.
    // Don't do the query if there is no filter.
    let threads = !validQuery ? [] : sync.await(db.collection('threads').find(query, {
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
      .skip(searchPage * Constants.THREADS_PER_PAGE)
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
    res.render('search', {
      author: authorUser,
      typeView: query.type || 'all',
      forumId: query.forumId,

      THREAD_TYPES: Constants.THREAD_TYPES,
      THREADS_PER_PAGE: Constants.THREADS_PER_PAGE,
      searchPage: searchPage + 1 /* Add one so it's no longer 0 indexed. */,
      threads: threads,
      user: req.session.username ? ServerUtils.getLightUserForUsername(req.session.username) : null
    });
  });
};

