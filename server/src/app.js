import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import DBConnector from "./db/connections.js";
import cors from "cors";
import AuthRouter from "./routes/auth.route.js";
import GroupRouter from "./routes/group.route.js";
import bodyParser from "body-parser";
import Group from "./models/group.model.js";

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

  // Handle chat messages
  socket.on(
    "chatMessage",
    async ({ groupKey, message = "", username, mediaFile = null }) => {
      console.log(`Message from ${username} in room ${groupKey}: ${message}`);
      const group = await Group.findOne({ groupKey });
      if (group) {
        group.messages.push({ username, message, mediaFile });
        await group.save();
      }

      io.to(groupKey).emit("reciveMessages", { messages: group?.messages });
    }
  );

  // Handle disconnections
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    // const rooms = await Group.find({ "allUsers.socketId": socket.id });
    // for (const room of rooms) {
    //   // Remove the user with the matching socket ID
    //   room.allUsers = room.allUsers.filter(
    //     (user) => user.socketId !== socket.id
    //   );
    //   await room.save();

    //   // Notify others in the room
    //   io.to(room.roomKey).emit("message", `A user has left the room.`);
    // }
  });
});

// Define a basic route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/group", GroupRouter);
// Check Existing room
// app.get("/check-room", async (req, res) => {
//   try {
//     const room = await Room.findOne({ roomKey: req.query.roomKey });
//     if (room) {
//       res.send({
//         roomKey: room.roomKey,
//         isExist: true,
//       });
//     } else {
//       res.send({
//         roomKey: room.roomKey,
//         isExist: false,
//       });
//     }
//   } catch (error) {
//     res.send({
//       error: error,
//       status: false,
//     });
//   }
// });

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
