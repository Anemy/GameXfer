// Fetches all of the forums for viewing.

// TODO: Get some cache in this.

import _ from 'underscore';
import sync from 'synchronize';

import db from '../../Database';
import Forums from '../../../shared/Forums';
import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  sync.fiber(() => {
    // When we've successfully deleted a message then we update the new messages length.
    let forums = sync.await(db.collection('forums').find({
      deleted: {
        $exists: false
      }
    }, {
      forumId: 1,
      threadsCreatedTotal: 1,
      mostRecentCommentTime: 1,
      mostRecentCommentAuthor: 1,
      mostRecentThreadTime: 1,
      mostRecentThreadAuthor: 1
    }).sort({
      mostRecentCommentTime: -1
    }).toArray(sync.defer()));

    if (!forums) { 
      res.status(400).send({
        err: 'Unable to find forums.'
      });
      return;
    }

    // Add the additional info into the forums.
    _.each(forums, (forum) => {
      // Copy all of the static data about the forum onto our locally pulled one.
      _.extend(forum, Forums.getForumInfoById(forum.forumId));

      if (forum && forum.mostRecentCommentAuthor) {
        forum.mostRecentCommentAuthor = ServerUtils.getLightUserObjectForUsername(forum.mostRecentCommentAuthor);
      }
      if (forum && forum.author) {
        forum.author = ServerUtils.getLightUserObjectForUsername(forum.author);
      }
    });
    
    res.status(200);
    res.render('forum-list', {
      forums: forums,
      categories: Forums.forumsAndCategories,
      user: req.session.username ? ServerUtils.getLightUserObjectForUsername(req.session.username) : null
    });
  });
};

