import mongoose from "mongoose";
import User from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { username, full_name, password, profile_pic, isActive } = req.body;

    // Validate required fields
    if (!username || !full_name || !password || !profile_pic) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      full_name,
      password,
      profile_pic,
      isActive,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        full_name: newUser.full_name,
        profile_pic: newUser.profile_pic,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }

    // Check if the password matches
    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = user.generateJWTToken();

    // Configure cookie options
    // const cookieOptions = {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    // };

    // Set the token in an HTTP-only cookie
    //res.cookie("accessToken", token, cookieOptions);

    // Send success response
    res.status(200).json({
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if the username exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(200)
        .json({ isAvailable: false, message: "Username is already taken" });
    }

    return res
      .status(200)
      .json({ isAvailable: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({
      message: "An error occurred while checking username availability",
    });
  }
};

const getDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID, excluding the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch request users in parallel
    const sendedRequestsUsers = await Promise.all(
      user.sendedRequests?.map((requesterId) =>
        User.findById(requesterId?.userId).select(
          "-password -sendedRequests -recivedRequests -updatedAt -createdAt"
        )
      ) || []
    );

    // Fetch pending request users in parallel
    const recivedRequestsUsers = await Promise.all(
      user.recivedRequests?.map((requesterId) =>
        User.findById(requesterId?.userId).select(
          "-password -sendedRequests -recivedRequests -updatedAt -createdAt"
        )
      ) || []
    );

    // Fetch pending request users in parallel
    const allFriends = await Promise.all(
      user.friends?.map((requesterId) =>
        User.findById(requesterId?.userId).select(
          "-password -sendedRequests -recivedRequests -updatedAt -createdAt"
        )
      ) || []
    );

    // Send user details as a response
    return res.status(200).json({
      message: "User details retrieved successfully",
      data: {
        user: {
          username: user.username,
          full_name: user?.full_name,
          profile_pic: user?.profile_pic,
          isActive: user?.isActive,
        },
        sendedRequestsUsers,
        recivedRequestsUsers,
        allFriends,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user details" });
  }
};

const searchPeople = async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.query;
    const { userId } = req.body; // Current user ID

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search for users whose username or full_name matches the query (case-insensitive),
    // excluding the current user
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { full_name: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: userId } }, // Exclude current user
        { isActive: true }, // Optional: Include only active users
      ],
    })
      .select("-password") // Exclude the password field
      .limit(parseInt(limit)); // Limit the number of results

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for users" });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    //console.log(username, "kyfiydu");

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find user by username (case-sensitive, adjust with regex if case-insensitivity is required)
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user" });
  }
};

const sendFriendRequest = async (req, res) => {
  const { userId, targetUserId } = req.body;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetUserId)
  ) {
    return res.status(400).json({ error: "Invalid user IDs provided." });
  }

  try {
    // Fetch current user and target user
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    // Check if a request already exists
    const requestIndex = currentUser.requests.findIndex(
      (request) => request.userId.toString() === targetUserId
    );

    const pendingIndex = targetUser.pendingRequests.findIndex(
      (request) => request.userId.toString() === userId
    );

    if (requestIndex !== -1 && pendingIndex !== -1) {
      // Friend request exists → Cancel request
      currentUser.requests.splice(requestIndex, 1);
      targetUser.pendingRequests.splice(pendingIndex, 1);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({ message: "Friend request canceled." });
    } else {
      // Friend request doesn't exist → Send request
      currentUser.requests.push({ userId: targetUserId });
      targetUser.pendingRequests.push({ userId: userId });

      await currentUser.save();
      await targetUser.save();

      return res
        .status(200)
        .json({ message: "Friend request sent successfully." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while toggling the friend request." });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { userId, targetUserId } = req.body;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetUserId)
  ) {
    return res.status(400).json({ error: "Invalid user IDs provided." });
  }

  try {
    // Fetch users
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    // Check if request exists
    const requestIndex = targetUser.receivedRequests.findIndex(
      (request) => request.userId.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ error: "No pending request found." });
    }

    // Remove from sendedRequests & receivedRequests
    targetUser.receivedRequests.splice(requestIndex, 1);
    currentUser.sendedRequests = currentUser.sendedRequests.filter(
      (request) => request.userId.toString() !== targetUserId
    );

    // Add to friends list
    currentUser.friends.push({ userId: targetUserId });
    targetUser.friends.push({ userId: userId });

    // Save changes
    await currentUser.save();
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Friend request accepted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while accepting the friend request." });
  }
};

const cancelFriendRequest = async (req, res) => {
  const { userId, targetUserId } = req.body;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetUserId)
  ) {
    return res.status(400).json({ error: "Invalid user IDs provided." });
  }

  try {
    // Fetch users
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    // Remove from sendedRequests & receivedRequests
    currentUser.sendedRequests = currentUser.sendedRequests.filter(
      (request) => request.userId.toString() !== targetUserId
    );

    targetUser.receivedRequests = targetUser.receivedRequests.filter(
      (request) => request.userId.toString() !== userId
    );

    // Save changes
    await currentUser.save();
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Friend request canceled successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while canceling the friend request." });
  }
};

export {
  registerUser,
  login,
  checkUsername,
  getDetails,
  searchPeople,
  getUserByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
};
