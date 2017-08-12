import sync from 'synchronize';

import Constants from '../../../shared/Constants';
import ServerUtils from '../../ServerUtils';
import Forums from '../../../shared/Forums';

export default (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  sync.fiber(() => {
    res.render('create-thread', {
      THREAD_TYPES: Constants.THREAD_TYPES,
      user: ServerUtils.getLightUserForUsername(req.session.username),
      forum: Forums.getForumInfoById(req.params.forumId)
    });
  });
};