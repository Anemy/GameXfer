// Sends the user a page with a forum's information and all of its threads.
// TODO: Build pages of the forums to get a certain range of threadHeaders.

// TODO: Cache this.

import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  let forumId = req.params.forumId;
  let forumPage = req.params.forumPage; // Optional.

  // Ensure the request has the proper attributes.
  if (!forumId) {
    res.status(400).send({
      err: 'Invalid forum get. Please specify a forumId.'
    });
    return;
  }

  if (Utils.isNumber(forumId)) {
    forumId = Number(forumId);
  }

  if (forumPage && Utils.isNumber(forumPage)) {
    forumPage = Number(forumPage);
  } else {
    forumPage = 0;
  }

  sync.fiber(() => {
    // When we've successfully deleted a message then we update the new messages length.
    const forum = sync.await(db.collection('forums').findOne({
      forumId: forumId
    }, {
      forumId: 1,
      title: 1,
      type: 1,
      threadsCreatedTotal: 1,
      threadHeaders: {
        // Get the Constants.AMOUNT_OF_THREADS_PER_PAGE threads based on the page number.
        $slice: [forumPage * Constants.AMOUNT_OF_THREADS_PER_PAGE, Constants.AMOUNT_OF_THREADS_PER_PAGE]
      }
    }, sync.defer()));

    if (!forum) { 
      res.status(400).send({
        err: 'Unable to find forum.'
      });
      return;
    }

    res.status(200);
    res.render('forum', {
      forum: forum
    });
  });
};

