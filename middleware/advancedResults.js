const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req into a new object
  const reqQuery = { ...req.query };

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
  query = model.find(JSON.parse(queryStr));

  // if request is select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //storing response
  const results = await query;

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

  res.advancedResults = {
    sucess: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
