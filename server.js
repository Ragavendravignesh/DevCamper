const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//To import routes
const bootcamps = require("./routes/bootcamps");

// To load environnment values
dotenv.config({ path: "./config/config.env" });

//To connect to database
connectDB();

const app = express();

app.use(express.json());
//app.use(logger);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//To mount routes
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode at ${PORT}`)
);

//To handle unhandled Exceptions
process.on('unhandledRejection', (err,promise) => {
  console.log(`Err: ${err.message}`);

  server.close(()=> process.exit(1));
})
