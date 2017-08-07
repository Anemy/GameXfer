import sync from 'synchronize';

import ServerUtils from '../../ServerUtils';
import Forums from '../../../shared/Forums';

export default (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  sync.fiber(() => {
    res.render('create-thread', {
      user: ServerUtils.getLightUserObjectForUsername(req.session.username),
      forum: Forums.getForumInfoById(req.params.forumId)
    });
  });
};