const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

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

// @desc Get single course
// @route GET api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Not able to find a course with an id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ sucess: true, data: course });
});

// @desc POST Add a new course
// @route GET api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot able to find a bootcamp with an id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ sucess: true, data: course });
});
