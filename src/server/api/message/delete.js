// Handles the request to delete inbox message(s).
import { ObjectId } from 'mongojs';
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const messagesToDeleteRequest = req.body.messagesToDelete;

  // Ensure the request has the proper attributes.
  if (!messagesToDeleteRequest || !Array.isArray(messagesToDeleteRequest)) {
    res.status(400).send({
      err: 'Invalid message to delete.'
    });
    return;
  }

  sync.fiber(() => {
    const currentTime = new Date();

    const messagesToDelete = Object.keys(messagesToDeleteRequest).map((key) => {
      return ObjectId(messagesToDeleteRequest[key]);
    });

    // Mark the messages as deleted.
    const deletedMessages = sync.await(db.collection('messages').update({
      destination: req.username,
      _id: {
        $in: messagesToDelete
      }
    }, {
      $set: { 
        deletedAt: currentTime
      }
    }, {
      multi: true 
    }, sync.defer()));

    if (!deletedMessages || deletedMessages.nModified !== messagesToDelete.length) { 
      res.status(400).send({
        err: 'Error: Unable to delete message(s).'
      });
      return;
    }

    // Count the amount of messages in the user's inbox.
    const messageCount = sync.await(db.collection('messages').count({
      username: req.username,
      deletedAt: {
        $exists: false
      }
    }, sync.defer()));

    // When we've successfully deleted a message then we update the new messages length.
    sync.await(db.collection('users').update({
      username: req.username,
    }, {
      $set: {
        messagesLength: messageCount
      }
    }, sync.defer()));

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    
    res.send({
      err: false
    });

    // Clean the excess trash.
    // Find the old messages over the max inbox size.
    const messagesToFullyDelete = sync.await(db.collection('messages').find({
      destination: req.username,
      deletedAt: {
        $exists: true
      }
    }, {
      _id : 1
    }).sort({
      deletedAt: 1
    })
      .skip(Constants.MAX_TRASH_SIZE)
      .map(function(doc) { 
        return doc._id; 
      }, sync.defer())); // Pull out just the _ids of the ones to exterminate.

    db.collection('messages').remove({
      _id: {
        $in: messagesToFullyDelete
      }
    }, sync.defer());

    ServerUtils.setUnreadOnUser(req.username);   
  });
};

