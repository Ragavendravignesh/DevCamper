const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  let error = { ...err };
  error.message = err.message;
  // Mongoose Invalid  objectId
  if (err.name === 'CastError') {
    const message = `Resource not found with an id of ${err.value}`;

    error = new ErrorResponse(message, 404);
  }

  //Mongoose Duplicate key
  if(err.code === 11000 ){
      const message = 'Duplicate key values added';

      error = new ErrorResponse(message,400);
  }

  //Mongoose Validation error
  if(err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      
      error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;