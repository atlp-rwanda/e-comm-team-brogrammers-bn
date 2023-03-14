const checkRole = (roles) => (req, res, next) => {
  try {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: `You are not a ${roles.join()}`,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

export default checkRole;
