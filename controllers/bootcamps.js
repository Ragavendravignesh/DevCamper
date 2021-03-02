const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/geocoder');
const Mongoose = require('mongoose');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }
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

  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});
