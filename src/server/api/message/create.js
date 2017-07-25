// Handles the request to send a message.

import sync from 'synchronize';
import uuidv1 from 'uuid/v1';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const destination = req.body.destination;
  const subject = req.body.subject;
  const text = req.body.text;

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
  if (!Utils.validMessageSubject(subject)) {
    res.status(400).send({
      err: 'Invalid message text to send.'
    });
    return;
  }

  sync.fiber(() => {
    const currentTime = new Date();

    const newMessage = {
      // Give the message a unique id to reference.
      messageId: uuidv1(),

      sender: req.username,

      subject: subject,
      text: text,

      sentAt: currentTime
    };

    // Save the new message into the destination user's inbox.
    const updatedUser = sync.await(db.collection('users').update({
      username: destination,
      
      // Ensure the user has room in their inbox.
      messagesLength: {
        $lt: Constants.MAX_INBOX_LENGTH
      }
    }, {
      $push: { 
        messages: newMessage 
      },
      $inc: { 
        messagesLength: 1
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
    // TODO: Render the user's inbox after sending a message, or the page they were just at.
    res.redirect('/');
  });
};

