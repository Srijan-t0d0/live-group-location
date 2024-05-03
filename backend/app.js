const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

const userLocations = {};

const emitUsersInRoom = (room, socket = null) => {
  if (userLocations[room]) {
    const usersInRoom = userLocations[room];
    Object.keys(usersInRoom).forEach((userName) => {
      const userData = usersInRoom[userName];
      if (socket) {
        socket.emit("Location_update", userData);
      } else {
        io.to(room).emit("Location_update", userData);
      }
    });
  }
};

// Enable CORS for Socket.io
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = socketIO(server, { cors: corsOptions });

// Apply CORS middleware to the Express app
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (data) => {
    const { name, room, location } = data;
    socket.join(room);
    socket.to(room).emit(name + "joined room" + room + " from" + location);

    if (!userLocations[room]) {
      userLocations[room] = {};
    }
    userLocations[room][name] = data;

    setTimeout(() => {
      socket.to(room).emit("Location_update", data);
      console.log(`${name} joined ${room} from ${JSON.stringify(location)}`);
      emitUsersInRoom(room, socket);
    }, 500);
  });

  socket.on("UserLocationUpdate", (data) => {
    // Update the last location update for this user in the room
    const { room, name, location } = data;

    if (!userLocations[room]) {
      userLocations[room] = {};
    }
    if (!userLocations[room][name]) {
      userLocations[room][name] = data;
    }
    userLocations[room][name]["location"] = location;

    // Broadcast the location update to all users in the room
    socket.to(room).emit("Location_update", data);
    setTimeout(() => {
      io.to(socket.id).emit("Location_update", data);
    }, 100);
  });

  socket.on("leaveRoom", (data) => {
    console.log(data.name + " left room " + data.room);
    if (userLocations[data.room] && userLocations[data.room][data.name]) {
      delete userLocations[data.room][data.name];
    }
    socket.to(data.room).emit("delete_user", data.name);
    setTimeout(() => emitUsersInRoom((room = data.room), socket), 500);
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Remove user's location update when they disconnect
  });
});

setInterval(() => console.log("User Locations:", userLocations), 10 * 1000);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
