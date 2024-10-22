const Group = require("../models/GroupModel");
const sendInvitationEmail = require("../../utils/mailer");
const Membership = require("../models/membershipModel");
const secretSantaAssignmentModel = require("../models/secretSantaAssignmentModel");
/**
 * Create a group
 * @route POST /groups
 * @description Creates a new group
 * @param {Object} req - HTTP request containing the group name in req.body
 * @param {Object} res - HTTP response returning the created group or an error
 * @returns {JSON} 201 with the created group if successful, otherwise 400 or an error
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, santaDate } = req.body;

    const user_id = req.user.id;

    const group = new Group({ name, santaDate, ownerId: user_id });
    const newGroup = await group.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: "Error creating group", error });
  }
};

/**
 * Get all groups
 * @route GET /groups
 * @description Retrieves a list of all groups
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response returning the groups or an error
 * @returns {JSON} 200 with the list of groups, otherwise 500 or an error
 */
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

/**
 * Get groups created
 * @route GET /groups/owned
 * @description Retrieves a list of all groups
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response returning the groups or an error
 * @returns {JSON} 200 with the list of groups, otherwise 500 or an error
 */
exports.getOwnedGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ ownerId: userId });

    const groupsWithMemberCount = await Promise.all(
      groups.map(async (group) => {
        const members = await Membership.countDocuments({ groupId: group._id });
        const santaAssigned =  await secretSantaAssignmentModel.countDocuments({ groupId: group._id }) !==0 ;
        return {
          ...group.toObject(),
          members,
          santaAssigned
        };
      })
    );

    res.status(200).json(groupsWithMemberCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

/**
 * Get groups where user is in
 * @route GET /groups/member
 * @description Retrieves a list of all groups
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response returning the groups or an error
 * @returns {JSON} 200 with the list of groups, otherwise 500 or an error
 */
exports.getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await Membership.find({ userId: userId });

    const groupIds = memberships.map((membership) => membership.groupId);

    const groups = await Group.find({ _id: { $in: groupIds } });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

/**
 * Get group by ID
 * @route GET /groups/:id
 * @description Retrieves a specific group by its ID
 * @param {Object} req - HTTP request containing the group ID in req.params.id
 * @param {Object} res - HTTP response returning the group or an error
 * @returns {JSON} 200 with the group if found, otherwise 404 or an error
 */
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    const santaAssigned =  await secretSantaAssignmentModel.countDocuments({ groupId: group._id }) !==0;
    
    res.status(200).json(  {
      ...group.toObject(),
      santaAssigned
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};

/**
 * Update group by ID
 * @route PUT /groups/:id
 * @description Updates a specific group by its ID
 * @param {Object} req - HTTP request containing the updated group data in req.body
 * @param {Object} res - HTTP response returning the updated group or an error
 * @returns {JSON} 200 with the updated group if successful, otherwise 404 or an error
 */
exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ message: "Error updating group", error });
  }
};

/**
 * Delete group by ID
 * @route DELETE /groups/:id
 * @description Deletes a specific group by its ID
 * @param {Object} req - HTTP request containing the group ID in req.params.id
 * @param {Object} res - HTTP response with status 204 if deleted successfully, otherwise 404 or an error
 * @returns {Void} Sends a 204 status if successful, otherwise 404 or an error
 */
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting group", error });
  }
};

/**
 * Send invitation via email
 * @route POST /groups/invite
 * @description Sends an invitation email to a specified receiver
 * @param {Object} req - HTTP request containing the receiver's email in req.body
 * @param {Object} res - HTTP response with a success message or an error
 * @returns {JSON} 200 if email sent successfully, otherwise 500 or an error
 */
exports.invite = async (req, res) => {
  const { receivers, groupName } = req.body;

  try {
    const emailPromises = receivers.map((receiver) => sendInvitationEmail(receiver, groupName));
    await Promise.all(emailPromises);
    res.status(200).json({ message: "Invitation email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending invitation email", error });
  }
};
