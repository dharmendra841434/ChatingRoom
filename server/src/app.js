import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import Room from "./models/room.model.js";
import DBConnector from "./db/connections.js";
import cors from "cors";
import AuthRouter from "./routes/auth.route.js";
import bodyParser from "body-parser";

// Create an Express application
const app = express();
const server = http.createServer(app);
dotenv.config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing; restrict in production
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

DBConnector();

app.use(
  cors({
    origin: "*", // Update to match your frontend URL
  })
);

// Handle client connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a chat room
  socket.on("joinRoom", async ({ roomKey, owner, username }) => {
    console.log(`User ${username} (${socket.id}) joined room ${roomKey}`);
    socket.join(roomKey);

    // Find the room and determine if it exists
    let room = await Room.findOne({ roomKey });

    if (!room) {
      // If the room doesn't exist, create it and add the owner to allUsers
      console.log(`Room ${roomKey} created by ${owner}`);
      room = new Room({
        roomKey,
        owner,
        allUsers: [{ username, socketId: socket.id }], // Add the owner as the first user
      });
      await room.save();
    } else {
      // Update user's socketId if they already exist, otherwise add them
      const userExists = room.allUsers.some(
        (user) => user.username === username
      );

      if (userExists) {
        // Update the socketId of the existing user
        await Room.updateOne(
          { roomKey, "allUsers.username": username },
          { $set: { "allUsers.$.socketId": socket.id } }
        );
      } else {
        // Add the new user to the allUsers array
        await Room.updateOne(
          { roomKey },
          {
            $addToSet: { allUsers: { username, socketId: socket.id } },
          }
        );
      }
    }

    // Emit the updated user list to all users in the room
    const updatedRoom = await Room.findOne({ roomKey }); // Retrieve the updated room data
    io.to(roomKey).emit("user:joined", {
      username,
      allUsers: updatedRoom.allUsers, // Send the updated list of users
    });
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ roomKey, message, username }) => {
    console.log(`Message from ${username} in room ${roomKey}: ${message}`);

    const room = await Room.findOne({ roomKey });
    if (room) {
      room.messages.push({ username, message });
      await room.save();
    }

    io.to(roomKey).emit("reciveMessages", { messages: room?.messages });
  });

  // Handle disconnections
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    const rooms = await Room.find({ "allUsers.socketId": socket.id });
    for (const room of rooms) {
      // Remove the user with the matching socket ID
      room.allUsers = room.allUsers.filter(
        (user) => user.socketId !== socket.id
      );
      await room.save();

      // Notify others in the room
      io.to(room.roomKey).emit("message", `A user has left the room.`);
    }
  });
});

// Define a basic route
app.get("/", (req, res) => {
  res.send("Group Chat Server is running.");
});

app.use("/api/v1/auth", AuthRouter);

// Check Existing room
app.get("/check-room", async (req, res) => {
  try {
    const room = await Room.findOne({ roomKey: req.query.roomKey });
    if (room) {
      res.send({
        roomKey: room.roomKey,
        isExist: true,
      });
    } else {
      res.send({
        roomKey: room.roomKey,
        isExist: false,
      });
    }
  } catch (error) {
    res.send({
      error: error,
      status: false,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
