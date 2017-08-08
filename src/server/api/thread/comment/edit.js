// Handles the request to create a thread in a forum.

import sync from 'synchronize';

import db from '../../../Database';
import ServerUtils from '../../../ServerUtils';
import Utils from '../../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid edit comment request.'
    });
    return;
  }

  const forumId = req.body.forumId;
  const threadId = req.body.threadId;
  let commentId = req.body.commentId;
  let text = req.body.text;

  // Ensure the comment has the proper attributes.
  if (!forumId || !threadId || !text || !commentId) {
    res.status(400).send({
      err: 'Invalid edit comment request data.'
    });
    return;
  }
  
  // Ensure the comment text conforms to the guidelines. 
  if (!Utils.validCommentText(text)) {
    res.status(400).send({
      err: 'Invalid edit comment attempt. Please try again and follow the guidelines.'
    });
    return;
  }

  // Format the comment.
  text = ServerUtils.formatComment(text);

  // Ensure the comment still conforms to the guidelines after being formatted.
  if (!Utils.validCommentText(text)) {
    res.status(400).send({
      err: 'Invalid edit comment attempt. Please try again and follow the guidelines.'
    });
    return;
  }

  if (Utils.isNumber(commentId)) {
    commentId = Number(commentId);
  }

  sync.fiber(() => {
    const currentTime = new Date();

    // Try to update the comment.
    const updateCommentResult = sync.await(db.collection('threads').update({
      threadId: threadId,
      forumId: forumId,
      comments: {
        $elemMatch: { 
          commentId: commentId,
          // Ensure the user wrote the comment.
          author: req.username
        }
      }
    }, {
      $set: {
        'comments.$.text': text,
        'comments.$.editedAt': currentTime
      }
    }, sync.defer()));

    if (!updateCommentResult || updateCommentResult.nModified !== 1) { 
      res.status(400).send({
        err: 'Unable to edit comment please refresh and try again.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      err: false,
      editedAt: currentTime
    });
  });
};

