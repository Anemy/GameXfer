// Get a thread to view.

// Sends the user thread with an optional commentId.
// TODO: Build pages of the forums to get a certain range of threadHeaders.

// TODO: Decide if it's worth caching these.

import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  let forumId = req.params.forumId;
  let threadId = req.params.threadId;

  let commentId = req.params.commentId;

  // Ensure the request has the proper attributes.
  if (forumId === undefined || threadId === undefined) {
    res.status(400).send({
      err: 'Invalid thread request. Please specify a forumId and a threadId.'
    });
    return;
  }

  if (Utils.isNumber(commentId)) {
    commentId = Number(commentId);
  } else {
    // Default the searched for comment to 0.
    commentId = 0;
  }

  if (Utils.isNumber(threadId)) {
    threadId = Number(threadId);
  }

  if (Utils.isNumber(forumId)) {
    forumId = Number(forumId);
  }

  sync.fiber(() => {
    // Get the requested thread and update the views on it.
    const thread = sync.await(db.collection('threads').findAndModify({
      query: {
        forumId: forumId,
        threadId: threadId,
      }, 
      fields: {
        subject: 1,
        type: 1,
        author: 1,
        views: 1,
        createdAt: 1,
        commentsLength: 1,
        comments: {
          // Get the Constants.AMOUNT_OF_COMMENTS_PER_PAGE threads based on the page number.
          $slice: [commentId * Constants.AMOUNT_OF_COMMENTS_PER_PAGE, Constants.AMOUNT_OF_COMMENTS_PER_PAGE]
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

    res.status(200);
    res.render('thread', {
      thread: thread
    });
  });
};

