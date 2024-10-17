module.exports = (server) => {
  const membershipController = require("../controllers/membershipController");
  const { verifyToken } = require("../middlewares/jwtMiddleware");
  const { checkGroupOwner } = require("../middlewares/checkGroupOwner");
  const { validateMembership } = require("../middlewares/validateMembership");

  server
    .route("/groups/:groupId/members")
    .get(verifyToken, membershipController.getGroupMembers)
    .post(
      verifyToken,
      validateMembership,
      checkGroupOwner,
      membershipController.addMember
    );

  server
    .route("/groups/:groupId/members/:userId")
    .put(
      verifyToken,
      validateMembership,
      checkGroupOwner,
      membershipController.updateMemberStatus
    )
    .delete(verifyToken, checkGroupOwner, membershipController.removeMember);
};
