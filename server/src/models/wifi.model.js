// models/meeting.model.ts
import mongoose, { Schema } from "mongoose";

// Define MongoDB schemas and models
const WifiSchema = new mongoose.Schema({
  device: { type: String, required: true, unique: true },
  deviceActivity: [
    {
      wifiIP: { type: String, required: true },
      connectedAt: { type: String, required: true },
      disconnectedAt: { type: String, required: true },
    },
  ],
});

const Device = mongoose.model("deviceActivity", WifiSchema);

export default Device;
