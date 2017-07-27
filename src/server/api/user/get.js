// Sends a user's information. Used for viewing profiles.

// Handles the request to login.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  let username = req.params.username;

  if (!username) {
    res.status(400).send({
      err: 'Invalid get user info request. Please specify a username.'
    });
    return;
  }

  sync.fiber(() => {
    const user = sync.await(db.collection('users').findOne({
      username: username
    }, {
      username: 1,
      posts: 1,
      xferCoin: 1
    }, sync.defer()));

    // Check if the user exists.
    if (!user) {
      res.status(400).send({
        err: 'That user wasn\'t found. Please try again.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
      err: false,
      user: user
    });
  });
};