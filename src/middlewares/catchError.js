export default (middleware) => async (req, res, next) => {
  try {
    await middleware(req, res, next);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
