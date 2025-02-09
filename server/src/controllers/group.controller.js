import mongoose from "mongoose";
import Group from "../models/group.model.js";
import { generateRandomString, getRandomHexColor } from "../utils/helper.js";

const getAllGroupsOfUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find groups containing the user
    const groups = await Group.find({
      allUsers: { $elemMatch: { userId: new mongoose.Types.ObjectId(userId) } },
    });

    if (!groups.length) {
      return res
        .status(200)
        .json({ message: "No groups found for the user", data: [] });
    }

    // Send success response
    return res.status(200).json({
      message: " Groups found successfully",
      data: {
        groups,
      },
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching groups" });
  }
};

const createNewGroup = async (req, res) => {
  try {
    const { userId, groupName } = req.body;

    // Validate input
    if (!userId || !groupName) {
      return res
        .status(400)
        .json({ message: "User ID and Group Name are required" });
    }

    // Generate a random group key
    const groupKey = generateRandomString(15);

    // console.log(
    //   `Creating group: userId: ${userId}, groupName: ${groupName}, groupKey: ${groupKey}`
    // );

    // Create the new group in the database
    const newGroup = await Group.create({
      groupKey: groupKey,
      groupName: groupName,
      allUsers: [{ userId: userId }],
      messages: [],
      owner: userId,
      groupIconColor: getRandomHexColor(),
    });

    // Send success response
    return res.status(201).json({
      message: "Group created successfully",
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the group" });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { userId, groupKey } = req.body;

    // Validate input
    if (!userId || !groupKey) {
      return res
        .status(400)
        .json({ message: "User ID and Group Key are required" });
    }

    // Find the group and add the user to it
    const group = await Group.findOneAndUpdate(
      { groupKey },
      {
        $addToSet: { allUsers: { userId } },
      },
      { new: true } // Returns the updated group
    );

    // If the group doesn't exist, send an error response
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Send success response
    return res.status(200).json({
      message: "User joined successfully",
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res
      .status(500)
      .json({ message: "An error occurred while joining the group" });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupKey } = req.body;

    // Validate input
    if (!groupKey) {
      return res.status(400).json({ message: "Group Key is required" });
    }

    // Find and delete the group
    const group = await Group.findOneAndDelete({ groupKey });

    // If the group doesn't exist, send an error response
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Send success response
    return res.status(200).json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the group" });
  }
};

// Mark a message as read by adding userId to the read array
const markMessageAsRead = async (req, res) => {
  try {
    const { groupId, messageId, userId } = req.body;

    if (!groupId || !messageId || !userId) {
      return res
        .status(400)
        .json({ error: "groupId, messageId, and userId are required" });
    }

    const group = await Group.findOneAndUpdate(
      { _id: groupId, "messages._id": messageId },
      { $addToSet: { "messages.$.read": userId } }, // Add userId only if not already present
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: "Group or message not found" });
    }

    res.status(200).json({ message: "Message marked as read", group });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

const markAllMessagesAsRead = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ error: "groupId and userId are required" });
    }

    // Update the group to mark all messages as read by adding userId to the read array for each message
    const group = await Group.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { "messages.read": userId } }, // Add userId to the "read" array for all messages
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure no duplicates for userId in the "read" array by adding it for all messages
    res.status(200).json({ message: "All messages marked as read", group });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export {
  getAllGroupsOfUser,
  createNewGroup,
  joinGroup,
  deleteGroup,
  markMessageAsRead,
  markAllMessagesAsRead,
};
