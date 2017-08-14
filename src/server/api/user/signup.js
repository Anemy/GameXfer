// Handles the request to signup.

import sync from 'synchronize';

import bcrypt from '../../bcrypt/Bcrypt';
import Constants from '../../ServerConstants';
import db from '../../Database';
import Utils from '../../../Shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid signup request.'
    });
    return;
  }

  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  // Validify the username.
  if (!Utils.validUsername(username)) {
    res.status(400).send({
      err: 'Error: Invalid username.'
    });
    return;
  }

  // Strip leading and trailing spaces.
  username = username.trim();

  const displayUsername = username;
  username = username.toLowerCase();

  // Validify the email.
  if (!Utils.validEmail(email)) {
    res.status(400).send({
      err: 'Error: Invalid email.'
    });
    return;
  }

  // Validify the password.
  if (!Utils.validPassword(password)) {
    res.status(400).send({
      err: 'Error: Invalid password.'
    });
    return;
  }

  sync.fiber(() => {
    // TODO: Make this an or with the email.
    const usernameAlreadyExists = sync.await(db.collection('users').findOne({
      username: username
    }, sync.defer()));

    // Check if the username already exists.
    if (usernameAlreadyExists) {
      res.status(400).send({
        err: 'Username already exists. Please try again.'
      });
      return;
    }

    const emailAlreadyExists = sync.await(db.collection('users').findOne({
      email: email
    }, sync.defer()));

    // Check if the new email already exists.
    if (emailAlreadyExists) {
      res.status(400).send({
        err: 'Email already exists. Please try again.'
      });
      return;
    }

    // Get the hash of the password to save.
    bcrypt.getBCryptHash(Constants.SIGNUP_HASH, password, (hash) => {
      // This is not async/await because it uses promises.
      // https://github.com/alexeypetrushin/synchronize/issues/56

      if (!hash) { 
        res.status(500).send({
          err: 'Server error.'
        });
        return;
      }

      sync.fiber(() => {
        // Save the new user.
        const currentTime = new Date();
        const createdUser = sync.await(db.collection('users').insert({
          username: username,
          displayUsername: displayUsername,
          email: email,
          password: hash,

          xferCoin: 0,

          messages: [],
          messagesRecievedTotal: 0,
          messagesLength: 0,
          hasUnread: false,

          trackedThreadIds: [],

          createdAt: currentTime,
          savedAt: currentTime
        }, sync.defer()));

        if (!createdUser) { 
          res.status(500).send({
            err: 'Server error.'
          });
          return;
        }

        // Success! Sign the new user in.
        req.session.username = createdUser.username;

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.redirect('/');
      });
    });
  });
};

