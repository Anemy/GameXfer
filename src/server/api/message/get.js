// Handles the request to get a user's messages.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  sync.fiber(() => {
    // Try to retrieve the user's messages.
    const user = sync.await(db.collection('users').findOne({
      username: req.username
    }, {
      messages: 1
    }, sync.defer()));

    if (!user) { 
      res.status(400).send({
        err: 'Unable to find messages. Do you exist?'
      });
      return;
    }

    res.status(200);

    res.render('inbox', {
      messages: user.messages
    });
  });
};

