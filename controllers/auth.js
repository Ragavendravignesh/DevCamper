const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Resiter a user
// @route POST api/v1/auth/register
// @access Public
exports.registerUser = asyncHandler(async (req, res, next) => {
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
