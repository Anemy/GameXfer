// Logs the user out if they have a session.

export default (req, res) => {
  if (req.session.username) {
    delete req.session.username;

    res.status(200).send({
      err: false
    });
  } else {
    res.status(400).send({
      err: 'Not logged in.'
    });
  }
};