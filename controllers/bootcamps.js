const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/geocoder');
const Mongoose = require('mongoose');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req into a new object
  const reqQuery = { ...req.query };
  console.log(reqQuery);

  //array for remove keywords
  const removeFields = ['select', 'sort', 'limit', 'page'];

  //removing those keywords from request
  removeFields.forEach((param) => delete reqQuery[param]);

  //converting into a string
  let queryStr = JSON.stringify(reqQuery);

  //converting into $gt $lt etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Making request
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // if request is select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  console.log(limit, ' - ', startIndex);

  query = query.skip(startIndex).limit(limit);

  //storing response
  const bootcamps = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  //If correctly formatted but not exist
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create a bootcamp
// @route POST api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ sucess: true, data: bootcamp });
});

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/delete/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc Get bootcamp within a raidus
// @route DELETE api/v1/bootcamps//radius/:zipcode/:distance
// @access Private
exports.getBootCampByRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geoCoder.geocode(zipcode);

  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  //Calculate radius by using earth radius
  // Eath Raidus 3958 mi
  const radius = distance / 3958;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  console.log(bootcamps);

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
