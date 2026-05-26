const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

module.exports = io;