const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan')

//To import routes
const bootcamps = require("./routes/bootcamps");

// To load environnment values
dotenv.config({ path: "./config/config.env" });

const app = express();

//app.use(logger);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//To mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode at ${PORT}`)
);
