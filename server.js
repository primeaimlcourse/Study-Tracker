const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

// Map device IDs to usernames
const deviceMap = {
  // fill these AFTER testing both devices!
  DEV_984253569: "purna",
  DEV_946776546: "nikhil",
};

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("deviceLogin", (deviceId) => {
    const user = deviceMap[deviceId];

    if (!user) {
      // console.log("Unknown device:", deviceId);
      socket.emit("errorMessage", "Device not registered");
      return;
    }

    onlineUsers[socket.id] = user;
    io.emit("statusUpdate", onlineUsers);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("statusUpdate", onlineUsers);
  });
});

server.listen(3000, () => console.log("Server running..."));
