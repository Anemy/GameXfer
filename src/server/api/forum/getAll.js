// Fetches all of the forums for viewing.

// TODO: Cache this.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  sync.fiber(() => {
    // When we've successfully deleted a message then we update the new messages length.
    const forums = sync.await(db.collection('forums').find({
      deleted: {
        $exists: false
      }
    }, {
      forumName: 1,
      type: 1,
      threadsCreatedTotal: 1,
      mostRecentCommentTime: 1,
      mostRecentCommentAuthor: 1,
      mostRecentThreadTime: 1,
      mostRecentThreadAuthor: 1,
    }, sync.defer()));

    if (!forums) { 
      res.status(400).send({
        err: 'Unable to find forums.'
      });
      return;
    }

    res.status(200);
    res.render('forums', {
      forums: forums
    });
  });
};

