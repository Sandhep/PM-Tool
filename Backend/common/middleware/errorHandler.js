import log from '../utils/Logger.js'

export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  log.error(err);

  res.status(status).json({
    success: false,
    error: message
  });
}