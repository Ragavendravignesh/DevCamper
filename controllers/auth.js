const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Resiter a user
// @route POST api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  const user = await User.create({
    name,
    email,
    role,
    password,
  });

  //create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc Login a user
// @route POST api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid crdentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
