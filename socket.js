let io;

module.exports = {
  init: (httpServer, cors) => {
    io = require("socket.io")(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!.");
    }
    return io;
  },
};