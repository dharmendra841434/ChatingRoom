// models/meeting.model.ts
import mongoose, { Schema } from "mongoose";

// Define MongoDB schemas and models
const RoomSchema = new mongoose.Schema({
  roomKey: { type: String, required: true, unique: true },
  allUsers: {
    type: [
      {
        username: { type: String, required: true },
        socketId: { type: String, required: true },
      },
    ],
    default: [], // Default value is an empty array
  },
  messages: [
    {
      username: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  owner: { type: String, required: true },
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
