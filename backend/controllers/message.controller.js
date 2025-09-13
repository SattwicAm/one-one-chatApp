import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  res.status(201).json(message);
};

export const getMessages = async (req, res) => {
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};

// ✅ Update a message
export const updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this message" });
    }

    message.content = req.body.content;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
