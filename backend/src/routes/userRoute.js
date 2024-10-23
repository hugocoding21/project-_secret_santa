const Roles = require("../enum/roles.enum");

module.exports = (server) => {
  const userController = require("../controllers/userController");
  const { verifyToken } = require("../middlewares/jwtMiddleware");
  const { validationMiddleware } = require("../middlewares/validationMiddleware");
  const { authorizeRoles } = require("../middlewares/rolesVerifMiddleware");

  server.route("/register").post(validationMiddleware, userController.userRegister);

  server.route("/login").post(validationMiddleware, userController.userLogin);

  server
    .route("/users/:user_id")
    .get(verifyToken,authorizeRoles([Roles.USER]), userController.getUser)
    .put(verifyToken, userController.modifyUser)
    .delete(verifyToken, userController.deleteUser);
    server
    
    .route("/users/:user_id/change-password")
    .put(verifyToken,validationMiddleware, userController.changePassword);
    
};
