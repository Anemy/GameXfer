import sync from 'synchronize';

import ServerUtils from '../../ServerUtils';

export default (req, res) => {
  sync.fiber(() => {
    res.render('create-message', {
      user: ServerUtils.getLightUserForUsername(req.username)
    });
  });
};