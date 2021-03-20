const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const { findById, listenerCount } = require('../models/Bootcamp');

// @desc Get all courses
// @route GET api/v1/courses - get all course
// @route GET api/v1/bootcamps/:bootcampId/courses -get all courses for that id
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const result = await Course.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({ success: true, count: result.length, data: result });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot able to find a bootcamp with an id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'role') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not owns this bootcamp, so can't add course`,
        401
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ sucess: true, data: course });
});

// @desc PUT Update a course
// @route PUT api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `Cannot able to fetch a course with an id of ${req.params.id}`,
        404
      )
    );
  }

  //Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'role') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not owns this course, so can't update`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ sucess: true, data: course });
});

// @desc DELETE To Delete a course
// @route DELETE api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `Cannot able to fetch a course with an id of ${req.params.id}`,
        404
      )
    );
  }

  //Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'role') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not owns this course, so can't delete`,
        401
      )
    );
  }

  await course.remove();
  res.status(200).json({ sucess: true, data: {} });
});
