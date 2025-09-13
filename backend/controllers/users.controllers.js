import User from "../models/user.model.js";
import multer from "multer";
import { cloudinary } from "../cloudinary.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );
  res.json(users);
};

export const setProfileImage = async (req, res) => {
  try {
    const { username } = req.body;
    let updateData = { name: username };

    const finishUpdate = () => {
      User.findByIdAndUpdate(req.user._id, updateData, { new: true })
        .then((updated) => res.json(updated))
        .catch((err) =>
          res.status(500).json({ message: "Update failed", err })
        );
    };

    // Upload image if present
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "profiles",
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Upload failed", error });
          }

          updateData.avatar = result.secure_url;
          finishUpdate();
        }
      );

      req.file.stream.pipe(stream);
    } else {
      // No image, only username update
      const updated = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
      });
      res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatar = ""; // or your default image URL
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error removing avatar:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
