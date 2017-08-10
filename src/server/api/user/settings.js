// Handles the request to save settings.

import sync from 'synchronize';
import url from 'url';

import db from '../../Database';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  console.log('Performing the save action on a user\'s settings');
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid settings save request.'
    });
    return;
  }

  let changeObject = {};

  if (req.body.biography && Utils.validBiography(req.body.biography)) {    
    changeObject.biography = ServerUtils.sanitizeAndMarkdown(req.body.biography);
  }

  // TODO: Check if it's a valid avatarURL.
  // Otherwise this is a big security problem?
  if (req.body.avatarURL) {
    const parsedAvatarURL = url.parse(req.body.avatarURL);
    console.log('parsedAvatarURL:');
    console.log(parsedAvatarURL);
    changeObject.avatarURL = req.body.avatarURL;
  }

  sync.fiber(() => {
    console.log('change object:', changeObject);

    // Try to update the user to save the settings.
    const updateUserResult = sync.await(db.collection('users').update({
      username: req.username
    }, {
      $set: changeObject
    }, sync.defer()));

    if (!updateUserResult || (updateUserResult.n !== 1 && updateUserResult.nModified !== 1)) { 
      res.status(400).send({
        err: 'Unable to edit settings please refresh and try again.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      err: false
    });
  });
};