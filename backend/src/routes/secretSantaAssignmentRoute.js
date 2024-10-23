module.exports = (server) => {
  const secretSantaAssignmentController = require("../controllers/secretSantaAssignmentController");
  const { verifyToken } = require("../middlewares/jwtMiddleware");
  const { checkGroupOwner } = require("../middlewares/checkGroupOwner");


  server
    .route("/groups/:groupId/secret-santa")
    .get(
      verifyToken,
      checkGroupOwner,
      secretSantaAssignmentController.getAllAssignments
    )
    .post(
      verifyToken,
      checkGroupOwner,
      secretSantaAssignmentController.assignSecretSantas
    )
    .delete(
      verifyToken,
      checkGroupOwner,
      secretSantaAssignmentController.clearAssignSecretSantas
    );


server
    .route("/groups/:groupId/secret-santa/:userId")
    .get(
      verifyToken,
      secretSantaAssignmentController.getAssignmentsByUserId
    );
};
