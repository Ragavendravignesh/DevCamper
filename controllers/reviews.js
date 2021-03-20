const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

// @desc Get all reviews
// @route GET api/v1/reviews - get all reviews
// @route GET api/v1/bootcamps/:bootcampId/reviews -get all review for that bootcamp id
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const result = await Review.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({ success: true, count: result.length, data: result });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route GET api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with an id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ succcess: true, data: review });
});
