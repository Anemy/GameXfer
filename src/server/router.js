import express from 'express';

// User
import login from './api/user/login';
import logout from './api/user/logout';
import signup from './api/user/signup';

import requireAuth from './requireAuth';

const router = express.Router();

router.get('/', (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  res.render('index', {
    username: req.session.username
  });
});

// User
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.post('/signup', signup);

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;