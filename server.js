const express = require('express');
const dotenv = require('dotenv');

// To load environnment values
dotenv.config({ path : './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen( PORT , console.log(`Server is running in ${process.env.NODE_ENV} mode at ${PORT}`));