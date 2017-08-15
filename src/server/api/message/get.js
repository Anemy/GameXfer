// Handles the request to get a user's messages.

import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  sync.fiber(() => {
    // Try to retrieve the user's messages.
    const messages = sync.await(db.collection('messages').find({
      destination: req.username,
      deletedAt: {
        $exists: false
      }
    }, { 
      _id: 1,
      sender: 1,
      destination: 1,

      subject: 1,
      text: 1,

      sentAt: 1
    }).toArray(sync.defer()));

    if (!messages) { 
      res.status(400).send({
        err: 'Unable to find messages. Do you exist?'
      });
      return;
    }

    res.status(200);

    res.render('inbox', {
      MAX_INBOX_LENGTH: Constants.MAX_INBOX_LENGTH,
      messages: messages,
      user: ServerUtils.getLightUserForUsername(req.username)
    });
  });
};

