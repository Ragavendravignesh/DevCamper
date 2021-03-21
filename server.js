const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoSantize = require('express-mongo-sanitize');

// To load environnment values
dotenv.config({ path: './config/config.env' });

//To import routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//To connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//app.use(logger);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//To use file upload
app.use(fileupload());

//To Santize requests
app.use(mongoSantize());

app.use(express.static(path.join(__dirname, 'public')));

//To mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode at ${PORT}`)
);

//To handle unhandled Exceptions
process.on('unhandledRejection', (err, promise) => {
  console.log(`Err: ${err.message}`);

  server.close(() => process.exit(1));
});
