/* eslint-disable require-jsdoc */
export default function paginatedResults(model) {
  return async (req, res, next) => {
    const totalCount = await model.count();
    // eslint-disable-next-line radix
    const page = parseInt(req.query.page) || 1;
    // eslint-disable-next-line radix
    const limit = parseInt(req.query.limit) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    try {
      if (endIndex < totalCount) {
        results.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit,
        };
      }
      results.totalCount = totalCount;
      results.totalPages = Math.ceil(totalCount / limit);
      results.results = await model.findAll({
        limit,
        offset: startIndex
      });
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
