// Logs the user out.

export default (req, res) => {
  delete req.session.username;

  res.status(200).send({
    err: false
  });
};