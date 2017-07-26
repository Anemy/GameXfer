import express from 'express';
import RateLimit from 'express-rate-limit';

// Forum
import getForum from './api/forum/get';
import getAllForums from './api/forum/getAll';

// User
import login from './api/user/login';
import logout from './api/user/logout';
import signup from './api/user/signup';

// Messages
import getMessages from './api/message/get';
import readMessage from './api/message/read';
import sendMessage from './api/message/create';
import deleteMessages from './api/message/delete';

import requireAuth from './requireAuth';

// 100 messages max over 10 minutes.
const basicLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayMs: 0,
  max: 100
});

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

const sendMessageLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 10, // Start blocking after 3 requests.
  message: 'Too many messages sent from this IP, you may try again in 10 minutes.'
});

const router = express.Router();

router.get('/', (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  res.render('index', {
    username: req.session.username
  });
});

// Forum
router.get('/forum/:id', getForum);
router.get('/forums', getAllForums);

// Messages
router.get('/inbox', basicLimiter, requireAuth, getMessages);
router.post('/message', sendMessageLimiter, requireAuth, sendMessage);
router.post('/message/read', basicLimiter, requireAuth, readMessage);
router.post('/message/delete', basicLimiter, requireAuth, deleteMessages);

// User
router.post('/login', loginLimiter, login);
router.post('/logout', requireAuth, logout);
router.post('/signup', signupLimiter, signup);

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;