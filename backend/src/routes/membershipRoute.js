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
      membershipController.addMembers
    );

  server
    .route("/groups/:groupId/members/:userId")
    .get(
      verifyToken,
      validateMembership,
      membershipController.verifyIsMemberOrOwner
    )
    .put(
      verifyToken,
      validateMembership,
      checkGroupOwner,
      membershipController.updateMemberStatus
    )
    .delete(verifyToken, checkGroupOwner, membershipController.removeMember);

  server
    .route("/groups/invitations/:userId")
    .get(verifyToken, membershipController.getAllInvitationForUser);
  server
    .route("/groups/:groupId/invitation/:userId/accept")
    .post(verifyToken, membershipController.acceptInvitation);
  server
    .route("/groups/:groupId/invitation/:userId/decline")
    .post(verifyToken, membershipController.declineInvitation);
};
