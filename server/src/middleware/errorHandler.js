export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === 'MulterError' ? 400 : 500);
  const message = error.name === 'MulterError' ? error.message : (status === 500 ? 'An unexpected server error occurred' : error.message);
  res.status(status).json({ message });
}
