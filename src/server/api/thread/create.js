// Handles the request to create a thread in a forum.

import sync from 'synchronize';

import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid thread creation request.'
    });
    return;
  }

  let forumId = req.body.forumId;
  const title = req.body.title;
  const description = req.body.description;
  const text = req.body.text;

  // Ensure the message has the proper attributes.
  if (forumId === undefined || !title || !text) {
    res.status(400).send({
      err: 'Invalid thread creation request.'
    });
    return;
  }

  if (Utils.isNumber(forumId)) {
    forumId = Number(forumId);
  }
  
  // Ensure the title of the message conforms to the guidelines. 
  if (!Utils.validThreadTitle(title)) {
    res.status(400).send({
      err: 'Invalid thread title.'
    });
    return;
  }

  if (!Utils.validThreadDescription(description)) {
    res.status(400).send({
      err: 'Invalid thread description.'
    });
    return;
  }

  // Ensure the message conforms to the message guidelines. 
  if (!Utils.validCommentText(text)) {
    res.status(400).send({
      err: 'Invalid thread first comment attempt. Please try again and follow the guidelines.'
    });
    return;
  }

  sync.fiber(() => {
    const currentTime = new Date();

    // Update the amount of threads created in the forum. We use this a key for the thread in combination with the forum id.
    const forum = sync.await(db.collection('forums').findAndModify({
      query: {
        forumId: forumId
      }, 
      update: {
        $inc: {
          threadsCreatedTotal: 1
        }
      }, 
      fields: {
        threadsCreatedTotal: 1
      },
      new: 1,
    }, sync.defer()));

    if (!forum) {
      res.status(400).send({
        err: 'Unable to find forum to create the thread in please refresh and try again.'
      });
      return;
    }

    const newThread = {
      // Give the thread a unique id to reference.
      threadId: forum.threadsCreatedTotal,
      forumId: forumId,

      title: title,
      description: description,

      views: 0,

      commentsLength: 1,
      comments: [{
        commentId: 1,
        createdAt: currentTime,
        
        text: text,
        author: req.user
      }],

      createdAt: currentTime
    };

    // Try to save the thread.
    const newThreadResult = sync.await(db.collection('threads').insert(newThread, sync.defer()));

    if (!newThreadResult) { 
      res.status(400).send({
        err: 'Unable to create thread please refresh and try again.'
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
        mostRecentCommentId: 0 /* It was the first comment on the thread. */,
        mostRecentCommentThreadId: newThread.threadId,
        mostRecentCommentForumId: forumId,
      },
      $inc: {
        posts: 1
      }
    }, sync.defer()));

    // Update the forum for its most recent thread posting.
    const updatedForumResult = sync.await(db.collection('forums').update({
      forumId: forumId,
      deleted: {
        $exists: false
      }
    }, { 
      $set: {
        mostRecentThreadId: newThread.threadId,
        mostRecentThreadTime: currentTime,
        mostRecentThreadAuthor: req.user,

        mostRecentCommentTime: currentTime,
        mostRecentCommentId: 0 /* It was the first comment on the thread. */,
        mostRecentCommentAuthor: req.user,
        mostRecentCommentThreadId: newThread.threadId,
      },
      $inc: {
        threadsCreatedTotal: 1
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

    // Redirect to the newly posted thread.
    res.redirect(`/f/${forumId}/t/${newThread.threadId}`);
  });
};

