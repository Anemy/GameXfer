import express from 'express';
import RateLimit from 'express-rate-limit';
import sync from 'synchronize';

// Comment
import editComment from './api/thread/comment/edit';
import createComment from './api/thread/comment/create';
import createCommentPage from './api/thread/comment/createCommentPage';

// Thread
import getThread from './api/thread/get';
import createThread from './api/thread/create';
import createThreadPage from './api/thread/createThreadPage';
import trackThread from './api/thread/track';

// Forum
import getForum from './api/forum/get';
import getAllForums from './api/forum/getAll';

// User
import getUser from './api/user/get';
import login from './api/user/login';
import logout from './api/user/logout';
import signup from './api/user/signup';
import settings from './api/user/settings';

import signS3 from './api/signS3';

// XferCoin
import sendCoin from './api/coin/send';

// Messages
import getMessages from './api/message/get';
import readMessage from './api/message/read';
import sendMessage from './api/message/create';
import deleteMessages from './api/message/delete';

import requireAuth from './requireAuth';

import ServerUtils from './ServerUtils';

// 100 messages max over 5 minutes.
const basicLimiter = new RateLimit({
  windowMs: 5*60*1000, // 5 minute window.
  delayMs: 0,
  max: 100
});

const profileImageUploadLimiter = new RateLimit({
  windowMs: 3*60*1000, // 3 minute window.
  delayMs: 0, // Slow down subsequent responses by 1 second per request.
  max: 6, // Start blocking after 5 requests.
  message: 'Too many image change requests from this IP, you may try again in 10 minutes.'
});

const sendCoinLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 3, // Begin slowing down responses after two requests.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 5, // Start blocking after 5 requests.
  message: 'Too many send coin requests from this IP, you may try again in 10 minutes.'
});

const loginLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window. 
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 10, // Start blocking after 3 requests.
  message: 'Too many login requests from this IP, you may try again in 10 minutes.'
});

const signupLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 6, // Start blocking after 6 requests.
  message: 'Too many signup account attempts created from this IP, please try again in fifteen minutes.'
});

const createCommentLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 5, // Start blocking after 5 requests.
  message: 'Too many comment creation requests from this IP, you may try again in 10 minutes.'
});

const createThreadLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 3, // Start blocking after 3 requests.
  message: 'Too many thread creation requests from this IP, you may try again in 10 minutes.'
});

const sendMessageLimiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minute window.
  delayAfter: 1, // Begin slowing down responses after the first request.
  delayMs: 1000, // Slow down subsequent responses by 1 second per request.
  max: 10, // Start blocking after 3 requests.
  message: 'Too many messages sent from this IP, you may try again in 10 minutes.'
});

const router = express.Router();

function renderWithUser(req, res, template, options) {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  if (req.session.username) {
    sync.fiber(() => {
      res.render(template, {
        user: ServerUtils.getLightUserForUsername(req.session.username, options)
      });
    });
  } else {
    res.render(template);
  }
}

// Comment 
router.post('/comment/edit', createCommentLimiter, requireAuth, editComment);
router.post('/comment/create', createCommentLimiter, requireAuth, createComment);
router.get('/f/:forumId/t/:threadId/create-comment', requireAuth, createCommentPage);

// Thread 
router.get('/f/:forumId/t/:threadId', getThread);
router.get('/f/:forumId/create-thread', requireAuth, createThreadPage);
router.get('/f/:forumId/t/:threadId/c/:commentId', getThread);
router.post('/thread/create', createThreadLimiter, requireAuth, createThread);
router.post('/thread/track', requireAuth, basicLimiter, trackThread);

// Forum
router.get('/f/:forumId/p/:forumPage', getForum);
router.get('/f/:forumId', getForum);
router.get('/forums', getAllForums);
router.get('/', getAllForums);

// Messages
router.get('/inbox', basicLimiter, requireAuth, getMessages);
router.post('/message', sendMessageLimiter, requireAuth, sendMessage);
router.post('/message/read', basicLimiter, requireAuth, readMessage);
router.post('/message/delete', basicLimiter, requireAuth, deleteMessages);

// XferCoin
router.post('/send-coin', sendCoinLimiter, requireAuth, sendCoin);
router.get('/coins', requireAuth, (req, res) => {
  renderWithUser(req, res, 'coins');
});

// User
router.get('/u/:username', basicLimiter, requireAuth, getUser);
router.post('/login', loginLimiter, login);
router.post('/logout', requireAuth, logout);
router.post('/signup', signupLimiter, signup);
router.post('/settings', basicLimiter, requireAuth, settings);

// User pages
router.get('/login', (req, res) => {
  renderWithUser(req, res, 'login');
});
router.get('/signup', (req, res) => {
  renderWithUser(req, res, 'signup');
});
router.get('/forgot-password', requireAuth, (req, res) => {
  renderWithUser(req, res, 'forgot-password');
});
router.get('/posts', requireAuth, (req, res) => {
  renderWithUser(req, res, 'posts');
});
router.get('/tracker', requireAuth, (req, res) => {
  renderWithUser(req, res, 'tracker');
});
router.get('/settings', requireAuth, (req, res) => {
  renderWithUser(req, res, 'settings', {
    biography: 1,
    mostRecentCommentTime: 1,
    mostRecentCommentId: 1,
    mostRecentCommentThreadId: 1,
    mostRecentCommentForumId: 1
  });
});
router.get('/sign-s3', profileImageUploadLimiter, requireAuth, signS3);

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;