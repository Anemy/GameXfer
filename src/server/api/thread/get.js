// Get a thread to view.

// Sends the user thread with an optional commentId.

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

  let commentId = req.params.commentId;

  // Ensure the request has the proper attributes.
  if (forumId === undefined || threadId === undefined) {
    res.status(400).send({
      err: 'Invalid thread request. Please specify a forumId and a threadId.'
    });
    return;
  }

  sync.fiber(() => {
    if (Utils.isNumber(commentId)) {
      commentId = Math.floor(Number(commentId));

      // Round to the nearest page amount of comments so we return the page's items.
      commentId = Math.floor(commentId / Constants.COMMENTS_PER_PAGE) * Constants.COMMENTS_PER_PAGE;
    } else if (commentId === Constants.MOST_RECENT_COMMENT) {
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
    } else {
      // Default the searched for comment to 0.
      commentId = 0;
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
        mostRecentcommentId: 1,
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
      thread.mostRecentCommentAuthor = ServerUtils.getLightUserObjectForUsername(thread.mostRecentCommentAuthor);
    }

    if (thread.author) {
      thread.author = ServerUtils.getLightUserObjectForUsername(thread.author);
    }

    _.each(thread.comments, (comment) => {
      if (comment && comment.author) {
        comment.author = ServerUtils.getLightUserObjectForUsername(comment.author);
      }
    });

    res.status(200);
    res.render('thread', {
      forum: thread ? Forums.getForumInfoById(thread.forumId) : null,
      thread: thread, 
      user: req.session.username ? ServerUtils.getLightUserObjectForUsername(req.session.username) : null
    });
  });
};

