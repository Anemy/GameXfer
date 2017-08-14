// Get a thread to view.

// Sends the user thread with an optional commentId which we refer the page number from.
// And optional linked-comment to autoscroll to.

// TODO: Decide if it's worth caching these.

import _ from 'underscore'; 
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Forums from '../../../shared/Forums';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  const forumId = req.params.forumId;
  const threadId = req.params.threadId;

  const requestedCommentId = req.params.commentId;

  // Ensure the request has the proper attributes.
  if (forumId === undefined || threadId === undefined) {
    res.status(400).send({
      err: 'Invalid thread request. Please specify a forumId and a threadId.'
    });
    return;
  }

  sync.fiber(() => {
    let commentId = 0;
    if (Utils.isNumber(requestedCommentId)) {
      commentId = Math.floor(Number(requestedCommentId));

      // Round to the nearest page amount of comments so we return the page's items.
      commentId = Math.floor(commentId / Constants.COMMENTS_PER_PAGE) * Constants.COMMENTS_PER_PAGE;
    } else if (requestedCommentId === Constants.MOST_RECENT_COMMENT) {
      const thread = sync.await(db.collection('threads').findOne({
        forumId: forumId,
        threadId: threadId,
      }, {
        commentsLength: 1,
      }, sync.defer()));

      if (thread) {
        commentId = Math.floor((Number(thread.commentsLength)-1) / Constants.COMMENTS_PER_PAGE) * Constants.COMMENTS_PER_PAGE;
      } else {
        commentId = 0;
      }
    }

    // Get the requested thread and update the views on it.
    const thread = sync.await(db.collection('threads').findAndModify({
      query: {
        forumId: forumId,
        threadId: threadId,
      }, 
      fields: {
        title: 1,
        forumId: 1,
        threadId: 1,
        description: 1,
        type: 1,
        author: 1,
        views: 1,
        createdAt: 1,
        mostRecentCommentAuthor: 1,
        mostRecentCommentTime: 1,
        mostRecentCommentId: 1,
        commentsLength: 1,
        comments: {
          // Get the Constants.COMMENTS_PER_PAGE comments based on the comment number.
          $slice: [commentId, Constants.COMMENTS_PER_PAGE]
        }
      },
      update: {
        $inc: {
          views: 1
        }
      },
      // Return the updated version of the thread.
      new: 1
    }, sync.defer()));

    if (!thread) { 
      res.status(400).send({
        err: 'Unable to find thread or comment.'
      });
      return;
    }

    if (thread.mostRecentCommentAuthor) {
      thread.mostRecentCommentAuthor = ServerUtils.getLightUserForUsername(thread.mostRecentCommentAuthor);
    }

    if (thread.author) {
      thread.author = ServerUtils.getLightUserForUsername(thread.author);
    }

    _.each(thread.comments, (comment) => {
      if (comment && comment.author) {
        comment.author = ServerUtils.getLightUserForUsername(comment.author);
      }
    });

    let user = null;
    let tracked = false;

    // Get the user's info when they're signed in.
    if (req.session && req.session.username) {
      user = sync.await(db.collection('users').findOne({
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

      if (user) {
        // See if the user is currently tracking the post.
        _.each(user.trackedThreads, (trackedThread) => {
          if (trackedThread.forumId === forumId && trackedThread.threadId === threadId) {
            tracked = true;
          }
        });
      }
    }


    res.status(200);
    res.render('thread', {
      // This is a user supplied param so we need to be careful with how we use it.
      // Currently it's sanitized though so we're okay.
      commentId: commentId,
      COMMENTS_PER_PAGE: Constants.COMMENTS_PER_PAGE,
      forum: thread ? Forums.getForumInfoById(thread.forumId) : null,
      thread: thread,
      trackedThread: tracked,
      user: user
    });
  });
};

