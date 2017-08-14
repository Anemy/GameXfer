// Handles the request to track or untrack a thread in a forum.

import _ from 'underscore';
import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid track comment request.'
    });
    return;
  }

  const forumId = req.body.forumId;
  const threadId = req.body.threadId;
  // Converted to boolean.
  const trackThread = req.body.trackThread === 'true';

  // Ensure the track has the proper attributes.
  if (!forumId || !threadId) {
    res.status(400).send({
      err: 'Invalid track thread request data.'
    });
    return;
  }

  sync.fiber(() => {
    const user = sync.await(db.collection('users').findOne({
      username: req.username
    }, {
      trackedThreads: 1,
      timesShownTrackingLimitWarning: 1
    }, sync.defer()));

    if (!user) {
      res.status(400).send({
        err: 'Unable to track thread: Your user does not exist.'
      });
      return;
    }

    let update = {};

    // TODO: Clean up these ugly if elses.
    if (trackThread) {
      // When a user is tracking the max amount of threads, we pop the oldest when we add this new one.
      if (user.trackedThreads && user.trackedThreads.length >= Constants.MAX_TRACKED_LENGTH) {
        update.$pop = {
          trackedThreads: -1
        };
      } 

      if (user.trackedThreads && user.trackedThreads.length > Constants.SHOW_TRACKING_LIMIT &&
          (!user.timesShownTrackingLimitWarning || user.timesShownTrackingLimitWarning < Constants.TRACKING_LIMIT_WARNING_TIMES)) {
        // We show the user an alert that we're deleting their old tracks.
        // This ensures we don't notifiy them too many times.
        update.$inc = {
          timesShownTrackingLimitWarning: 1
        };
      }

      let alreadyTracking = false;
      // See if the user is currently tracking the post.
      _.each(user.trackedThreads, (trackedThread) => {
        if (trackedThread.forumId === forumId && trackedThread.threadId === threadId) {
          alreadyTracking = true;
        }
      });

      if (!alreadyTracking) {
        const currentTime = new Date();

        const newTrackedThread = {
          forumId: forumId,
          threadId: threadId,
          trackedAt: currentTime
        };

        update.$push = {
          trackedThreads: newTrackedThread
        };
      }
    } else {
      // When a user wants to untrack a thread we perform a pull update.
      update.$pull = {
        trackedThreads: {
          threadId: threadId,
          forumId: forumId
        }
      };
    }

    // Only update when we have something to do.
    if (!_.isEmpty(update)) {
      // Update the user for the new tracked state.
      const updateUserResult = sync.await(db.collection('users').update({
        username: req.username,
      }, update, sync.defer()));

      if (!updateUserResult || updateUserResult.nModified !== 1) { 
        res.status(400).send({
          err: 'Unable to track thread please refresh and try again.'
        });
        return;
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);

    res.send({
      err: false,
      trackedThreadsLength: user.trackedThreads ? user.trackedThreads.length : 0,
      timesShownTrackingLimitWarning: user.timesShownTrackingLimitWarning
    });
  });
};

