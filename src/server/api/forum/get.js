// Sends the user a page with a forum's information and all of its threads.
// TODO: Build pages of the forums to get a certain range of threadHeaders.

// TODO: Cache this.

import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  // This will be a param?
  const forumId = req.body.forumId;

  // Ensure the request has the proper attributes.
  if (!forumId) {
    res.status(400).send({
      err: 'Invalid forum get. Please specify a forumId.'
    });
    return;
  }

  let page = 0;
  if (req.body.forumPage && Utils.isNumber(req.body.forumPage)) {
    const newNumber = Number(req.body.forumPage);

    if (newNumber > 0) {
      page = newNumber;
    }
  }

  sync.fiber(() => {
    // When we've successfully deleted a message then we update the new messages length.
    const forum = sync.await(db.collection('forums').find({
      forumId: forumId
    }, {
      forumName: 1,
      type: 1,
      threadHeaders: {
        // Get the Constants.AMOUNT_OF_THREADS_PER_PAGE threads based on the page number.
        $slice: [page * Constants.AMOUNT_OF_THREADS_PER_PAGE, Constants.AMOUNT_OF_THREADS_PER_PAGE]
      }
    }, sync.defer()));

    if (!forum) { 
      res.status(400).send({
        err: 'Unable to find forum.'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({
      err: false,
      msg: forum
    });
  });
};

