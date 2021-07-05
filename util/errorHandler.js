/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  // res.sendStatus(err.status || 500);
  res.status(err.status || 500);
  res.json({
    status: 'error',
    error: err.message
  });
};
