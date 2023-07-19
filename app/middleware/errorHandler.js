const CustomError = require('./CustomError');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
