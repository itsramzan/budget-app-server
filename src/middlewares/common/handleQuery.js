// Middleware for pagination
export const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit =
    parseInt(req.query.limit) || parseInt(process.env.PAGINATION_DEFAULT_LIMIT);
  const skip = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    skip,
  };

  next();
};

// Middleware for sorting
export const sort = (req, res, next) => {
  const { sort } = req.query;

  let sorting = [];
  if (sort) {
    sorting = sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return [field.slice(1), -1];
      }
      return [field, 1];
    });
  } else {
    sorting = [];
  }

  req.sorting = sorting;

  next();
};

export default [paginate, sort];
