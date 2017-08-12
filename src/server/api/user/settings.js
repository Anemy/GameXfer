// Handles the request to save settings.

import sync from 'synchronize';
import url from 'url';

import db from '../../Database';
import ServerConstants from '../../ServerConstants';
import ServerUtils from '../../ServerUtils';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid settings save request.'
    });
    return;
  }

  let changeObject = {};

  if (req.body.biography && Utils.validBiography(req.body.biography)) {    
    changeObject.biography = ServerUtils.sanitize(req.body.biography);
  }

  // Ensure it's a valid avatarURL.
  if (req.body.avatarURL) {
    const parsedAvatarURL = url.parse(req.body.avatarURL);
    if (parsedAvatarURL && parsedAvatarURL.host === ServerConstants.S3_BUCKET + '.s3.amazonaws.com') {
      changeObject.avatarURL = req.body.avatarURL;
    }
  }

  sync.fiber(() => {
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