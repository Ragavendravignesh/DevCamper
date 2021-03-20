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

// @desc Add review
// @route POST api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});

// @desc Update review
// @route PUT api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
  
    if(!review) {
      return next(
        new ErrorResponse(
          `Review not found with an id of ${req.params.id}`,
          404
        )
      );
    }
  
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User not authorized to update this review', 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true
    });
  
    res.status(200).json({ success: true, data: review });
  });

// @desc Delete review
// @route delete api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
  
    if(!review) {
      return next(
        new ErrorResponse(
          `Review not found with an id of ${req.params.id}`,
          404
        )
      );
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User not authorized to update this review', 401));
    }

    await review.remove();
  
    res.status(200).json({ success: true, data: {} });
  });
