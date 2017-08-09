// Handles the request to create a thread in a forum.

import sync from 'synchronize';

import db from '../../../Database';
import ServerUtils from '../../../ServerUtils';
import Utils from '../../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid create comment request.'
    });
    return;
  }

  const forumId = req.body.forumId;
  const threadId = req.body.threadId;
  let text = req.body.text;

  // Ensure the comment has the proper attributes.
  if (forumId === undefined || threadId === undefined || !text) {
    res.status(400).send({
      err: 'Invalid create comment request data.'
    });
    return;
  }
  
  // Ensure the comment text conforms to the guidelines. 
  if (!Utils.validCommentText(text)) {
    res.status(400).send({
      err: 'Invalid thread comment attempt. Please try again and follow the guidelines.'
    });
    return;
  }

  // Format the comment.
  text = ServerUtils.formatComment(text);

  // Ensure the comment still conforms to the guidelines after being formatted.
  if (!Utils.validCommentText(text)) {
    res.status(400).send({
      err: 'Invalid thread comment attempt. Please try again and follow the guidelines.'
    });
    return;
  }

  sync.fiber(() => {
    // Update the amount of comments created in the thread. We use this a key for the comment in combination with the thread id and forum id.
    const thread = sync.await(db.collection('threads').findAndModify({
      query: {
        threadId: threadId,
        forumId: forumId
      }, 
      update: {
        $inc: {
          commentsLength: 1
        }
      }, 
      fields: {
        commentsLength: 1
      },
      new: 1,
    }, sync.defer()));

    if (!thread) {
      res.status(400).send({
        err: 'Invalid thread to comment on.'
      });
      return;
    }

    const currentTime = new Date();

    const newComment = {
      // Give the comment an id.
      commentId: thread.commentsLength,

      author: req.username,

      text: text,

      createdAt: currentTime
    };

    // Try to post the comment.
    const newCommentResult = sync.await(db.collection('threads').update({
      threadId: threadId,
      forumId: forumId
    }, {
      $push: {
        comments: newComment
      },
      $set: {
        mostRecentCommentTime: currentTime,
        mostRecentCommentId: newComment.commentId,
        mostRecentCommentAuthor: req.username
      }
    }, sync.defer()));

    if (!newCommentResult || newCommentResult.nModified !== 1) { 
      res.status(400).send({
        err: 'Unable to create comment please refresh and try again.'
      });
      return;
    }

    // Update the user for their most recent thread posting.
    const updatedUserResult = sync.await(db.collection('users').update({
      username: req.username,
      deleted: {
        $exists: false
      }
    }, { 
      $set: {
        mostRecentCommentTime: currentTime,
        mostRecentCommentId: newComment.commentId,
        mostRecentCommentThreadId: threadId,
        mostRecentCommentForumId: forumId,
      },
      $inc: {
        posts: 1
      }
    }, sync.defer()));

    // Update the forum for its most recent comment posting.
    const updatedForumResult = sync.await(db.collection('forums').update({
      forumId: forumId,
      deleted: {
        $exists: false
      }
    }, { 
      $set: {
        mostRecentCommentTime: currentTime,
        mostRecentCommentId: newComment.commentId,
        mostRecentCommentAuthor: req.username,
        mostRecentCommentThreadId: threadId,
      }
    }, sync.defer()));

    let errorPosting;

    if (!updatedUserResult || updatedUserResult.nModified !== 1) {
      errorPosting = 'Error posting thread: The thread successfully posted, however it failed to associate itself with your user account. ';
    }

    if (!updatedForumResult || updatedForumResult.nModified !== 1) {
      errorPosting = 'Error posting thread: The thread successfully posted, however it failed to associate itself with the intended forum. ' + errorPosting;
    }

    if(errorPosting) {
      res.status(400).send({
        err: errorPosting
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      newCommentId: newComment.commentId,
      err: false
    });
  });
};

