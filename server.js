// import path from "path";
import http from "http";
import express from "express";
import { Server as socketio } from "socket.io";
// import messageFormatter.formatMessage from "./utils/messages.js";
import MessageFormatter from "./utils/messages.js";

import dotenv from "dotenv";
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from "./utils/users.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio(server);

// Set static folder
app.use(express.static("public"));

const botName = "My chat bot";
const messageFormatter = new MessageFormatter("My chat bot");

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      messageFormatter.formatMessage(botName, "Welcome to My chat room!")
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormatter.formatMessage(
          botName,
          `${user.username} has joined the chat`
        )
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit(
      "message",
      messageFormatter.formatMessage(user.username, msg)
    );
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        messageFormatter.formatMessage(
          botName,
          `${user.username} has left the chat`
        )
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
