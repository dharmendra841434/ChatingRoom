// models/meeting.model.ts
import mongoose, { Schema } from "mongoose";

// Define MongoDB schemas and models
const UserChatSchema = new mongoose.Schema({
  chatKey: { type: String, required: true, unique: true },
  participants: {
    type: [Object], // Allows any object format to be pushed dynamically
    required: true, // Ensures participants cannot be empty
  },
  messages: {
    type: [
      {
        username: String,
        message: {
          type: String,
          default: "",
        },
        timestamp: { type: Date, default: Date.now },
        mediaFile: {
          mediaType: {
            type: String,
          },
          url: {
            type: String,
          },
        },
        read: { type: [String], default: [] },
      },
    ],
    default: [],
    _id: false,
  },
});

const UserChat = mongoose.model("userChat", UserChatSchema);

export default UserChat;
