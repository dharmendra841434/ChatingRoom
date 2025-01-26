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
  socket.on("joinGroup", async ({ groupKey, owner, username, groupName }) => {
    //console.log(`User ${username} (${socket.id}) joined room ${roomKey}`);
    socket.join(groupKey);

    // Find the room and determine if it exists
    let group = await Group.findOne({ groupKey });

    if (!group) {
      // If the room doesn't exist, create it and add the owner to allUsers
      console.log(`group ${groupKey} created by ${owner}`);
      group = new Group({
        groupKey,
        groupName,
        owner,
        allUsers: [{ username, socketId: socket.id }], // Add the owner as the first user
      });
      await group.save();
    } else {
      // Update user's socketId if they already exist, otherwise add them
      const userExists = group.allUsers.some(
        (user) => user.username === username
      );

      if (userExists) {
        // Update the socketId of the existing user
        await Group.updateOne(
          { groupKey, "allUsers.username": username },
          { $set: { "allUsers.$.socketId": socket.id } }
        );
      } else {
        // Add the new user to the allUsers array
        await Group.updateOne(
          { groupKey },
          {
            $addToSet: { allUsers: { username, socketId: socket.id } },
          }
        );
      }
    }

    // Emit the updated user list to all users in the room
    const updatedGroup = await Group.findOne({ groupKey }); // Retrieve the updated room data
    io.to(groupKey).emit("user:joined", {
      username,
      allUsers: updatedGroup.allUsers, // Send the updated list of users
    });
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ groupKey, message, username }) => {
    console.log(`Message from ${username} in room ${groupKey}: ${message}`);

    const group = await Group.findOne({ groupKey });
    if (group) {
      group.messages.push({ username, message });
      await group.save();
    }

    io.to(groupKey).emit("reciveMessages", { messages: group?.messages });
  });

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
