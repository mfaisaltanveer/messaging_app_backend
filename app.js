const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const moment = require('moment');

//Json format middleware
app.use(bodyParser.json());

app.use(cors());

app.use((error, req, res, next) => {
  console.log("error= ", error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Server listen on port 3123
const server = app.listen(3123);
const io = require("./socket").init(server, cors);

//Connection establish with socket
io.on("connection", (socket) => {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
  io.emit("connection created", `OK:${timestamp}`);
  // Recieved message from client_side
  socket.on("new message", (message) => {
    // Send message to client_side
    io.emit("get message", {
      socketId: message.socketID,
      timestamp: timestamp,
      message: message.newMessage,
    });
    console.log(message.socketID, ":", timestamp, ":", message.newMessage);
  });

  // Socket disconnect event
  socket.on("disconnect", (message) => {
    console.log(message.socketID, ":", timestamp, ":", "Client Disconnected");
  });
});
