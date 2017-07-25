// Handles the request to get a user's messages.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  sync.fiber(() => {
    // Try to retrieve the user's messages.
    const user = sync.await(db.collection('users').findOne({
      username: req.username,
    }, {
      messages: 1
    }, sync.defer()));

    if (!user) { 
      res.status(400).send({
        err: 'Unable to find messages. Do you exist?'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    // TODO: Render the user's inbox after finding the messages.
    res.send({
      messages: user.messages
    });
  });
};

