const Group = require("../models/GroupModel");

exports.checkGroupOwner = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Accès interdit: vous n'êtes pas le créateur du groupe" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
