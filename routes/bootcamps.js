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

//import other resource router
const courseRouter = require('./courses');

const router = express.Router();

//pass onto other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootCampByRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
