// Logs the user out.

export default (req, res) => {
  if (req.session.username) {
    delete req.session.username;
  }

  res.status(200).send({
    err: false
  });
};