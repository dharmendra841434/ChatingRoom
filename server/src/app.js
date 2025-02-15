import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import DBConnector from "./db/connections.js";
import cors from "cors";
import AuthRouter from "./routes/auth.route.js";
import GroupRouter from "./routes/group.route.js";
import ChatRouter from "./routes/chat.route.js";
import bodyParser from "body-parser";
import Group from "./models/group.model.js";
import UserChat from "./models/userChat.js";
import admin from "firebase-admin";
import fs from "fs";
import { google } from "googleapis";
import axios from "axios";

// Create an Express application
const app = express();
const server = http.createServer(app);
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://chating-room.vercel.app"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

DBConnector();

const corsConfig = {
  origin: ["http://localhost:3000", "https://chating-room.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Include all HTTP methods you expect to use
  credentials: true, // Allow cookies to be sent/received
  allowedHeaders: ["Content-Type", "Authorization"], // Specify headers you allow
};

app.use(cors(corsConfig));

// Handle client connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a chat room
  socket.on("joinGroup", async ({ groupKey, username, userId }) => {
    console.log(`User ${username} joined room ${groupKey}`);
    socket.join(groupKey);

    // Find the group
    const group = await Group.findOne({ groupKey });

    if (!group) {
      socket.emit("error", { message: "Group not found" });
      return;
    }

    // Update all messages to mark them as read by this user
    const updatedMessages = group.messages.map((msg) => {
      if (!msg.read.includes(userId)) {
        msg.read.push(userId);
      }
      return msg;
    });

    // Save the updated group messages
    await Group.updateOne(
      { groupKey },
      { $set: { messages: updatedMessages } }
    );

    // Emit a message to the user that they have joined the room
    socket.emit("joinedGroup", {
      message: `Welcome to the group ${groupKey}!`,
      messages: updatedMessages,
    });
  });

  // Join a chat room
  socket.on("joinChat", async ({ chatKey, username }) => {
    console.log(`User ${username} joined room ${chatKey}`);
    socket.join(chatKey);
    // Emit a message to the user that they have joined the room
    const chat = await UserChat.findOne({ chatKey });
    socket.emit("joinedChat", {
      message: `Welcome to the group ${chatKey}! `,
      messages: chat?.messages,
    });
  });

  // Handle chat messages
  socket.on(
    "chatMessage",
    async ({ groupKey, message = "", username, mediaFile = null, userId }) => {
      console.log(
        `Message from ${username} in room ${groupKey}: ${message} ${mediaFile?.url}`
      );
      const group = await Group.findOne({ groupKey });
      if (group) {
        // Add the new message and mark the sender as having read it
        const newMessage = {
          username,
          message,
          mediaFile,
          read: [userId], // Add the sender's userId to the read array
        };

        group.messages.push(newMessage);
        await group.save();
      }

      io.to(groupKey).emit("receiveMessages", { messages: group?.messages });
    }
  );

  // Handle chat messages
  socket.on(
    "sendUserMessage",
    async ({ chatKey, message = "", username, mediaFile = null }) => {
      console.log(`Message from ${username} in room ${chatKey}: ${message}`);
      const userchat = await UserChat.findOne({ chatKey });
      if (userchat) {
        userchat.messages.push({ username, message, mediaFile });
        await userchat.save();
      }

      io.to(chatKey).emit("receiveUserMessages", {
        messages: userchat?.messages,
      });
    }
  );

  socket.on("sendNotification", async ({ message = "" }) => {
    //console.log(` Notification: ${message}`);

    io.emit("receiveNotification", {
      messages: ` Notification: ${message}`,
    });
  });

  // Handle disconnections
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
    "base64"
  ).toString("utf8")
);

// Function to get an access token using Google OAuth2
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount, // path to the service account key
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  try {
    const accessToken = await auth.getAccessToken();
    //console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

//console.log(serviceAccount, "Asdajsgd");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/api/v1/send-notification", async (req, res) => {
  try {
    const { deviceTokens, title, body } = req.body;

    if (deviceTokens?.length == 0 || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fcmToken, title, and body.",
      });
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve access token.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    for (let i = 0; i < deviceTokens.length; i++) {
      const fcmToken = deviceTokens[i];
      console.log(fcmToken, "this is device token ");

      const data = {
        message: {
          token: fcmToken,
          notification: {
            title,
            body,
          },
        },
      };

      await axios.post(
        "https://fcm.googleapis.com/v1/projects/pingpong-8a4de/messages:send",
        data,
        { headers }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully.",
      // firebaseResponse: response.data,
    });
  } catch (error) {
    console.error(
      "Error sending notification:",
      error?.response?.data || error.message
    );

    return res.status(error?.response?.status || 500).json({
      success: false,
      message: "Failed to send notification.",
      error: error?.response?.data || error.message,
    });
  }
});

// Define a basic route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/group", GroupRouter);
app.use("/api/v1/chat", ChatRouter);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
