module.exports = (server) => {
  const userController = require("../controllers/userController");
  const { verifyToken } = require("../middlewares/jwtMiddleware");
  const { validationMiddleware } = require("../middlewares/validationMiddleware");

  server.route("/register").post(validationMiddleware, userController.userRegister);

  server.route("/login").post(validationMiddleware, userController.userLogin);

  server
    .route("/users/:user_id")
    .get(verifyToken, userController.getUser)
    .put(verifyToken, userController.modifyUser)
    .delete(verifyToken, userController.deleteUser);
};
