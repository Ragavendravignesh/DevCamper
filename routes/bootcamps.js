const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootCampByRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

//import other resource router
const courseRouter = require('./courses');

const router = express.Router();

//pass onto other resource router
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootCampByRadius);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports = router;
