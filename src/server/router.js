import express from 'express';

import login from './api/login';
import logout from './api/logout';
import signup from './api/signup';

const router = express.Router();

router.get('/', (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  res.render('index', {
    username: req.session.username
  });
});


router.post('/login', login);
router.post('/logout', logout);

router.post('/signup', signup);

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;