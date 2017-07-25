/**
 * @Copyright GameXfer 2017
 *
 * This process recieves a password, hashes it, and sends the hash back.
 * This process also recieves a password, hashes it, and compares it to a hash, sending back the result.
 *
 **/

const bcrypt = require('bcrypt-nodejs');

const Constants = require('../ServerConstants');

process.on('message', (m) => {
  if (m.hashType === Constants.SIGNUP_HASH) {
    bcrypt.hash(m.color, null, null, (err, hash) => {

      if (!err) {
        process.send({
          hasHash: true,
          hash: hash,
          id: m.id
        });
      } else {
        process.send({
          hasHash: false,
          id: m.id
        });
      }
    });
  } else if (m.hashType === Constants.LOGIN_HASH) {
    bcrypt.compare(m.color[0], m.color[1], (err, res) => {
      if (err) {
        process.send({
          hasHash: false,
          id: m.id
        });
      } else {
        if (res) {
          // The hashes match.
          process.send({
            hasHash: true,
            hash: true,
            id: m.id
          });
        } else {
          // The hashes don't match.
          process.send({
            hasHash: true,
            hash: false,
            id: m.id
          });
        }
      }
    });
  }
});