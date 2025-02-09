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
  socket.on("joinGroup", async ({ groupKey, username }) => {
    console.log(`User ${username} joined room ${groupKey}`);
    socket.join(groupKey);
    // Emit a message to the user that they have joined the room
    const group = await Group.findOne({ groupKey });
    socket.emit("joinedGroup", {
      message: `Welcome to the group ${groupKey}! `,
      messages: group?.messages,
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
    console.log(` Notification: ${message}`);

    io.emit("receiveNotification", {
      messages: ` Notification: ${message}`,
    });
  });

  // Handle disconnections
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Define a basic route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Define a basic route
app.get("/testBG/:id", (req, res) => {
  console.log("API is called by android app");

  const routeParams = req.params;
  console.log("Route Parameters:", routeParams);

  res.status(200).json({
    message: "API called successfully",
    routeParams: routeParams,
  });
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/group", GroupRouter);
app.use("/api/v1/chat", ChatRouter);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
