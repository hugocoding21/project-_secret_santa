exports.validationMiddleware = (req, res, next) => {
  const { email, password, username } = req.body;

  if (req.path === '/register') {
      if (!email || !password || !username) {
          return res.status(400).json({ message: "Email, password, and username are required for registration." });
      }
  } else if (req.path === '/login') {
      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required for login." });
      }
  }

  next();
};
