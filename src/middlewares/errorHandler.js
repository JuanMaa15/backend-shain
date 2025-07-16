export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: err.status,
    code: statusCode,
    message: err.message || 'Ha ocurrido un error inesperado en el servidor. Por favor, intente nuevamente más tarde.'
  });

}