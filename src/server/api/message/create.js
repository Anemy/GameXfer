// Handles the request to create/send a message.

import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  let destination = req.body.destination;
  let subject = req.body.subject;
  let text = req.body.text;

  // Ensure the message has the proper attributes.
  if (!destination || !subject || !text) {
    res.status(400).send({
      err: 'Invalid message to send.'
    });
    return;
  }
  
  // Ensure the subject of the message conforms to the guidelines. 
  if (!Utils.validMessageSubject(subject)) {
    res.status(400).send({
      err: 'Invalid message subject to send.'
    });
    return;
  }

  // Ensure the message conforms to the message guidelines. 
  if (!Utils.validMessageText(text)) {
    res.status(400).send({
      err: 'Invalid message text to send.'
    });
    return;
  }

  // Format the comment.
  text = ServerUtils.sanitize(text);

  // Make sure the username is lowercase for the search.
  destination = destination.toLowerCase();

  sync.fiber(() => {
    const currentTime = new Date();

    const user = sync.await(db.collection('users').findOne({
      username: destination
    }, {
      username: 1,
      messagesLength: 1
    }, sync.defer()));

    if (!user) {
      res.status(400).send({
        err: 'Unable to send message: That user does not exist.'
      });
      return;
    }

    if (user.messagesLength >= Constants.MAX_INBOX_LENGTH) {
      res.status(400).send({
        err: 'Unable to send message: That user\'s inbox is full.'
      });
      return;
    }

    const newMessage = {
      sender: req.username,
      destination: destination,

      subject: subject,
      text: text,

      sentAt: currentTime
    };

    // Create the new message in the messages database.
    const addedMessage = sync.await(db.collection('messages').insert(newMessage, sync.defer()));

    if (!addedMessage || !addedMessage._id) { 
      res.status(400).send({
        err: 'Unable to create message. Please refresh and try again.'
      });
      return;
    }

    // Save the new message into the destination user's inbox.
    const updatedUser = sync.await(db.collection('users').update({
      username: destination,
    }, {
      $set: {
        hasUnread: true
      },
      $inc: { 
        messagesLength: 1,
        messagesRecievedTotal: 1
      }
    }, sync.defer()));

    if (!updatedUser || updatedUser.nModified !== 1) { 
      res.status(400).send({
        err: 'Unable to send message: That user does not exist or their inbox is full.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      err: false
    });
  });
};

