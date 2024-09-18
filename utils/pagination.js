const pagination = (req, data) => {
  // Get page and limit from request
  const page = req.page ? parseInt(req.page) : 1;
  const limit = req.limit ? parseInt(req.limit) : 6;

  // If limit is 0, return all data
  if (limit === 0) {
    return data;
  }

  // Calculate start and end index
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Initialize result object
  const result = {};

  // Set total count
  result.total = data.length;

  // Check for next page
  if (endIndex < data.length) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }

  // Check for previous page
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  // Slice data
  data = data.slice(startIndex, endIndex);
  result.data = data;

  // Return result
  return result;
};

module.exports = pagination;
