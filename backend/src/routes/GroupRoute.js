const groupController = require("../controllers/GroupController");
const { verifyToken } = require("../middlewares/jwtMiddleware");
module.exports = (server) => {
  server.route("/groups").get(groupController.getGroups).post(verifyToken, groupController.createGroup);

  server
    .route("/groups/:id")
    .get(verifyToken, groupController.getGroupById)
    .put(verifyToken, groupController.updateGroup)
    .delete(verifyToken, groupController.deleteGroup);
};
