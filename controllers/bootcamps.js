const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/geocoder');
const Mongoose = require('mongoose');
const path = require('path');
const advancedResults = require('../middleware/advancedResults');
const { listeners } = require('cluster');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  //Add user to req.body
  req.body.user = req.user.id;

  //get published bootcamp by user
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //A user other than admin, could only publish a single bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Sorry a user with id ${req.user.id} could only publish a single course`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ sucess: true, data: bootcamp });
});

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }

  //Make sure user owns the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Sorry, user ${req.user.id} with an id not owns this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

  //Make sure user owns the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Sorry, user ${req.user.id} with an id not owns this bootcamp`,
        401
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

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc To upload a photo
// @route PUT api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot fetch a Bootcamp with an id of ${req.params.id}`,
        404
      )
    );
  }

  //Make sure user owns the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Sorry, user ${req.user.id} with an id not owns this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload an file', 400));
  }

  const file = req.files.file;

  console.log(file.mimetype);

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  if (file.size > process.env.MAXMIMUM_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please include a file less than ${process.env.MAXMIMUM_FILE_SIZE}`,
        400
      )
    );
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new ErrorResponse('Oops there is a problem with file upload', 500)
      );
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
