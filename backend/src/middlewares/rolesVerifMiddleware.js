const jwt = require("jsonwebtoken");

exports.authorizeRoles = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (!requiredRoles.includes(req.user.roles)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};
