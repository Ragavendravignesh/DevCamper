const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    //If correctly formatted but not exist
    if (!bootcamp) {
      return res.status(400).json({ suucess: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Create a bootcamp
// @route POST api/v1/bootcamps
// @access Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ sucess: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
 try {
     const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
     });

     if(!bootcamp ){
         return res.status(400).json({ success : false , message: 'problem'});
     }

     res.status(200).json({ success: true, data: bootcamp });
 } catch (err) {
     res.status(400).json({ success: false });
 }
};

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp) {
        return res.status(400).json({ success:  false , message: "problem" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
      res.status(400).json({ success: false });
  }
};
