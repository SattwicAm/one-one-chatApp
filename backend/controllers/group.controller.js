// controllers/group.controller.js
import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";

export const createGroup = async (req, res) => {
  const { name, members } = req.body;
  const group = await Group.create({
    name,
    members: [...members, req.user._id],
  });
  res.status(201).json(group);
};

export const getAllGroups = async (req, res) => {
  const groups = await Group.find({ members: req.user._id });
  res.json(groups);
};

export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  const messages = await GroupMessage.find({ group: groupId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.json(messages);
};
