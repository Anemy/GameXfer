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
      const requestedUrl = req.originalUrl; // For full url include before originalUrl: req.protocol + '://' + req.get('host') + 
      res.status(403).redirect('/login?re=' + requestedUrl);
      return;
    }
  }

  req.username = req.session.username;

  next();
};