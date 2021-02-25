const Bootcamp = require('../models/Bootcamp')

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public   
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({ sucess: true, msg: "Show all bootcamps" });
}

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public   
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
}

// @desc Create a bootcamp
// @route POST api/v1/bootcamps
// @access Private   
exports.createBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({sucess: true, data: bootcamp });
    } catch (error) {
        res.status(400).json({sucess: false, message: error });
    } 
}

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private 
exports.updateBootcamp = (req,res,next) => {
    res
    .status(200)
    .json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });
}

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req,res,next) => {
    res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
}