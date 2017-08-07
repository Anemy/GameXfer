// Get a thread to view.

// Sends the user thread with an optional commentId.

// TODO: Decide if it's worth caching these.

import sync from 'synchronize';

import db from '../../Database';
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

  if (Utils.isNumber(commentId)) {
    commentId = Number(commentId);
  } else {
    // Default the searched for comment to 0.
    commentId = 0;
  }

  sync.fiber(() => {
    const currentTime = new Date();

    // Get the requested thread and delete it.
    const threadUpdateResult = sync.await(db.collection('threads').update({
      forumId: forumId,
      threadId: threadId
    }, {
      $set: {
        deletedAt: currentTime
      }
    }, sync.defer()));

    if (!threadUpdateResult || threadUpdateResult.nModified !== 1) { 
      res.status(400).send({
        err: 'Unable to delete thread please refresh and try again.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      err: false,
      threadId: threadId,
      forumId: forumId,
      deletedAt: currentTime
    });
  });
};

