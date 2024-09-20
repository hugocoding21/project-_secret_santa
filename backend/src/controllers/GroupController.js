const Group = require("../models/GroupModel");

exports.createGroup = async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    const group = new Group({ name, ownerId });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: "Error creating group", error });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ message: "Error updating group", error });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting group", error });
  }
};
