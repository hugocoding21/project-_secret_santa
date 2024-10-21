const jwt = require("jsonwebtoken");

exports.authorizeRoles = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const userRoles = req.user.roles.map(role => Number(role)); 

      if (!requiredRoles.some(requiredRole => userRoles.includes(requiredRole))) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

    next();
  };
};
