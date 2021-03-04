const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');

// @desc Get all courses
// @route GET api/v1/courses - get all course
// @route GET api/v1/bootcamps/:bootcampId/courses -get all courses for that id
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  console.log('hello');
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;
  res.status(200).json({ sucess: true, count: courses.length, data: courses });
});
