// Handles when a user views a message for the first time.

import _ from 'underscore';
import { ObjectId } from 'mongojs';
import sync from 'synchronize';

import db from '../../Database';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const messagesToMarkRequested = req.body.messagesToMark;
  // Cast to boolean.
  const markAsRead = req.body.markAsRead === 'true';

  // Ensure the request has the proper attributes.
  if (!messagesToMarkRequested || !Array.isArray(messagesToMarkRequested)) {
    res.status(400).send({
      err: 'Invalid message to mark.'
    });
    return;
  }

  const messagesToMark = Object.keys(messagesToMarkRequested).map((key) => {
    return ObjectId(messagesToMarkRequested[key]);
  });

  sync.fiber(() => {
    const currentTime = new Date();

    let update = {};
    if (markAsRead) {
      // Mark it as unread.
      update.$set = {
        readAt: currentTime
      };
    } else {
      // Mark it as unread.
      update.$unset = {
        readAt: 1
      };
    }

    // When we've successfully deleted a message then we update the new messages length.
    const updatedMessages = _.isEmpty(messagesToMark) ? [] : sync.await(db.collection('messages').update({
      destination: req.username,
      _id: {
        $in: messagesToMark
      }
    }, update, {
      multi: true
    }, sync.defer()));    

    if (!updatedMessages || updatedMessages.n !== messagesToMark.length) { 
      res.status(400).send({
        err: 'Unable to update message(s). Please refresh and try again.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({
      err: false,
      msg: 'success'
    });

    ServerUtils.setUnreadOnUser(req.username);   
  });
};

