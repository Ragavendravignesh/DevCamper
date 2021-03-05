const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { dirname } = require('path');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

const importData = async function () {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);

    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async function () {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') importData();
else if (process.argv[2] === '-d') deleteData();
