// Handles the request to login.

import sync from 'synchronize';

import bcrypt from '../../bcrypt/Bcrypt';
import Constants from '../../ServerConstants';
import db from '../../Database';
import Utils from '../../../Shared/Utils';

const misMatchMessage = 'That email & password combination doesn\'t exist. Please try again.';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid login request.'
    });
    return;
  }

  let email = req.body.email;
  let password = req.body.password;

  // Validify the email.
  if (!Utils.validEmail(email)) {
    res.status(400).send({
      err: misMatchMessage
    });
    return;
  }

  // Validify the password.
  if (!Utils.validPassword(password)) {
    res.status(400).send({
      err: misMatchMessage
    });
    return;
  }

  sync.fiber(() => {
    const user = sync.await(db.collection('users').findOne({
      email: email
    }, {
      password: 1,
      username: 1
    }, sync.defer()));

    // Check if the user exists.
    if (!user) {
      res.status(400).send({
        err: misMatchMessage
      });
      return;
    }

    // Hash the password and see if it matches.
    bcrypt.getBCryptHash(Constants.LOGIN_HASH, [password, user.password] , (response) => {
      // This is not async/await because it uses promises
      // https://github.com/alexeypetrushin/synchronize/issues/56

      if (!response) { 
        res.status(400).send({
          err: misMatchMessage
        });
        return;
      }

      // Success! Sign the new user in.
      req.session.username = user.username;

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({
        err: false,
        username: user.username
      });
    });
  });
};

