// Sends a user's information. Used for viewing profiles.

import sync from 'synchronize';

import db from '../../Database';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  let username = req.params.username;

  if (!username) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).send({
      err: 'Invalid get user info request. Please specify a username.'
    });
    return;
  }

  sync.fiber(() => {
    const profile = sync.await(db.collection('users').findOne({
      username: username
    }, {
      username: 1,
      displayUsername: 1,
      posts: 1,
      xferCoin: 1,
      biography: 1,
      threads: 1,
      avatarURL: 1,
      mostRecentCommentTime: 1,
      mostRecentCommentId: 1,
      mostRecentCommentThreadId: 1,
      mostRecentCommentForumId: 1
    }, sync.defer()));

    // When the user doesn't exist we just shoot them null for the profile and let the template handle it.

    res.status(200).render('profile', {
      err: false,
      profile: profile,
      user: req.session.username ? ServerUtils.getLightUserForUsername(req.session.username) : null
    });
  }); 
};