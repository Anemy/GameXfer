import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  // Send the rendered HTML page and attach the user's username if they are sessioned.
  res.render('index', {
    username: req.session.username
  });
});

module.exports = router;