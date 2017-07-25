import express from 'express';
import RateLimit from 'express-rate-limit';

const loginLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 10, // Start blocking after 3 requests.
  message: 'Too many login requests from this IP, you may try again in 10 minutes.'
});

const signupLimiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 3*1000, // Slow down subsequent responses by 3 seconds per request.
  max: 4, // Start blocking after 3 requests.
  message: 'Too many accounts created from this IP, please try again in an hour.'
});


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
router.post('/login', loginLimiter, login);
router.post('/logout', requireAuth, logout);
router.post('/signup', signupLimiter, signup);

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;