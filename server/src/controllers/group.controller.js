import mongoose from "mongoose";
import Group from "../models/group.model.js";
import { generateRandomString } from "../utils/helper.js";

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

    console.log(
      `Creating group: userId: ${userId}, groupName: ${groupName}, groupKey: ${groupKey}`
    );

    // Create the new group in the database
    const newGroup = await Group.create({
      groupKey: groupKey,
      groupName: groupName,
      allUsers: [{ userId: userId }],
      messages: [],
      owner: userId,
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

export { getAllGroupsOfUser, createNewGroup, joinGroup };
