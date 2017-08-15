import sync from 'synchronize';

import ServerUtils from '../../../ServerUtils';

export default (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  sync.fiber(() => {
    const forumId = req.params.forumId;
    const threadId = req.params.threadId;

    if (!forumId || !threadId) {
      // Bad request.
      res.status(400).send({
        err: 'Invalid thread request. Please specify a forumId and a threadId.'
      });
      return;
    }

    res.render('create-comment', {
      user: ServerUtils.getLightUserForUsername(req.session.username),
      thread: ServerUtils.getLightThreadById(forumId, threadId)
    });
  });
};