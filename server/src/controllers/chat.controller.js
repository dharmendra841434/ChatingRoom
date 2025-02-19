import UserChat from "../models/userChat.js";

const markAllMessagesAsRead = async (req, res) => {
  try {
    const { chatKey, userId } = req.body;

    // console.log(req?.body, "asrfgsaug");

    if (!chatKey || !userId) {
      return res.status(400).json({ error: "groupId and userId are required" });
    }

    const chat = await UserChat.findOneAndUpdate(
      { chatKey: chatKey },
      { $addToSet: { "messages.$[].read": userId.toString() } },
      { new: true } // Returns the updated document
    );

    if (!chat) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure no duplicates for userId in the "read" array by adding it for all messages
    res.status(200).json({ message: "All messages marked as read", chat });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

const getChatDataByUserId = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Find chats where userId is part of the chatKey
    const chats = await UserChat.find({
      chatKey: { $regex: userId }, // Checks if userId is included in chatKey
    });

    // Respond with the retrieved chats
    if (chats.length > 0) {
      return res.status(200).json(chats);
    } else {
      return res
        .status(200)
        .json({ message: "No chats found for the given userId" });
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { markAllMessagesAsRead, getChatDataByUserId };
