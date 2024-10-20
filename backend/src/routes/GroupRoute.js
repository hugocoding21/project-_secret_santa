const groupController = require("../controllers/GroupController");
const { verifyToken } = require("../middlewares/jwtMiddleware");
module.exports = (server) => {
  server.route("/invite").post(groupController.invite);

  server.route("/groups").get(groupController.getAllGroups).post(verifyToken, groupController.createGroup);

  server.route("/groups/owner").get(verifyToken, groupController.getOwnedGroups);
  server.route("/groups/member").get(verifyToken, groupController.getGroups);

  server
    .route("/groups/:id")
    .get(verifyToken, groupController.getGroupById)
    .put(verifyToken, groupController.updateGroup)
    .delete(verifyToken, groupController.deleteGroup);
};
