const { default: mongoose } = require("mongoose");

const filter = (queryParams) => {
  // Initialize query object
  const query = {};

  const condition = {};

  // Check if id is present in query parameters
  if (queryParams.id) {
    query._id = queryParams.id;
  }

  // Check if search is present in query parameters
  if (queryParams.search) {
    query.$or = [{ title: { $regex: queryParams.search, $options: "i" } }];
  }

  // Direct mappings
  const directMappings = [
    { param: "title", field: "title" },
    { param: "slug", field: "slug" },
    { param: "class", field: "classId" },
    { param: "subject", field: "subjectId" },
    { param: "author", field: "author" },
    { param: "publisher", field: "publisher" },
    { param: "by", field: "by" },
  ];

  // Map query parameters to query object
  directMappings.forEach((mapping) => {
    if (queryParams[mapping.param]) {
      if (mapping.param === "class") {
        if (!mongoose.Types.ObjectId.isValid(queryParams[mapping.param])) {
          condition.class = queryParams[mapping.param];
          return;
        }
      } else if (mapping.param === "subject") {
        if (!mongoose.Types.ObjectId.isValid(queryParams[mapping.param])) {
          condition.subject = queryParams[mapping.param];
          return;
        }
      }
      query[mapping.field] = queryParams[mapping.param];
    }
  });

  // Assign sort parameter
  const sort = query.sort || "title";

  // Return query and sort parameters
  return {
    query,
    sort,
    condition
  };
};

module.exports = filter;
