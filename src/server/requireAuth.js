export default (req, res, next) => {
  if (!req.session.username) {
    if (req.xhr) {
      // When the request is xhr we should just send them back a data package with the error.
      res.status(403).json({
        err: 'Request not authorized'
      });
      return;
    } else {
      // If the request was not xhr we should show them the login page so they can get authed.
      const requestedUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.status(403).redirect('/login?redirect=' + requestedUrl);
      return;
    }
  }

  req.username = req.session.username;

  next();
};