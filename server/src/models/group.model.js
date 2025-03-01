// models/meeting.model.ts
import mongoose, { Schema } from "mongoose";

// Define MongoDB schemas and models
const GroupSchema = new mongoose.Schema({
  groupKey: { type: String, required: true, unique: true },
  groupName: { type: String, required: true },
  allUsers: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],
    default: [],
    _id: false,
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
  },
  owner: { type: String, required: true },
  groupIconColor: { type: String, required: true },
  usersDeviceToken: { type: [String], default: [] },
});

const Group = mongoose.model("groups", GroupSchema);

export default Group;
