const Membership = require("../models/membershipModel");
const Group = require("../models/groupModel");
const User = require("../models/userModel");

// Utility function to check if a group exists
const checkGroupExists = async (groupId) => {
  return await Group.findById(groupId);
};

/**
 * @desc Add a member to a group by email
 * @route POST /groups/:groupId/members
 * @param {string} groupId - The ID of the group
 * @param {string} email - The email of the user to be added
 * @returns {Object} - The membership object or error message
 */
exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    const group = await checkGroupExists(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingMembership = await Membership.findOne({
      userId: user._id,
      groupId,
    });
    if (existingMembership) {
      return res.status(400).json({ message: "User is already a member or invited" });
    }

    const membership = new Membership({
      userId: user._id,
      groupId,
      isAccepted: false,
    });

    await membership.save();
    res.status(201).json({ message: "Invitation sent", membership });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
};

/**
 * @desc Get all members of a group
 * @route GET /groups/:groupId/members
 * @param {string} groupId - The ID of the group
 * @returns {Array} - List of group members or error message
 */
exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await checkGroupExists(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const members = await Membership.find({ groupId }).populate("userId", "username email");
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error getting group members", error });
  }
};

/**
 * @desc Update the acceptance status of a member in a group
 * @route PUT /groups/:groupId/members/:userId
 * @param {string} groupId - The ID of the group
 * @param {string} userId - The ID of the user
 * @param {boolean} isAccepted - Acceptance status
 * @returns {Object} - Updated membership object or error message
 */
exports.updateMemberStatus = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { isAccepted } = req.body;

    const group = await checkGroupExists(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const membership = await Membership.findOne({ userId, groupId });
    if (!membership) {
      return res.status(404).json({ message: "Member not found in this group" });
    }

    membership.isAccepted = isAccepted;
    membership.updatedAt = Date.now();

    await membership.save();
    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error updating member status", error });
  }
};

/**
 * @desc Remove a member from a group
 * @route DELETE /groups/:groupId/members/:userId
 * @param {string} groupId - The ID of the group
 * @param {string} userId - The ID of the user
 * @returns {Object} - Success message or error message
 */
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await checkGroupExists(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const membership = await Membership.findOneAndDelete({ userId, groupId });
    if (!membership) {
      return res.status(404).json({ message: "Member not found in this group" });
    }

    res.status(200).json({ message: "Member successfully removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member from group", error });
  }
};
