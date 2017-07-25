// Handles when a user views a message for the first time.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const messageId = req.body.messageId;

  // Ensure the request has the proper attributes.
  if (!messageId) {
    res.status(400).send({
      err: 'Invalid message to send.'
    });
    return;
  }

  sync.fiber(() => {
    const currentTime = new Date();

    // When we've successfully deleted a message then we update the new messages length.
    const updatedUser = sync.await(db.collection('users').update({
      username: req.username,
      messages: {
        $elemMatch: {
          messageId: messageId
        }
      }
    }, {
      $set: {
        'messages.$.readAt': currentTime
      }
    }, sync.defer()));

    if (!updatedUser || updatedUser.nModified !== 1) { 
      res.status(400).send({
        err: 'Unable to update message for readAt.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({
      err: false,
      msg: 'success'
    });
  });
};

