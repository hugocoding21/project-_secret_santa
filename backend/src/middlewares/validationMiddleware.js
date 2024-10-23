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
  }else if (req.path === `/users/${req.params.id}/change-password`) {
    if (!oldPassword || !newPassword ) {
      return res.status(400).json({ message: "Old password and new password  are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }
  }

  next();
};
