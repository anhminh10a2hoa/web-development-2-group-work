/**
 * Sets up a socket connection using socket.io
 */

const { Server } = require('socket.io');

let io;

/**
 * Sets up socket connection with provided server instance.
 * @param {http.Server} server - The HTTP server instance.
 */
const socketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:80",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected.');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

/**
 * Sends updated data to all connected clients.
 * @param {string} username - The username to send the update to.
 * @param {any} payload - The data payload to send.
 */
const updateData = (username, payload) => {
  if (io) {
    io.emit(`update-${username}`, { 
      orders: payload
    });
  } else {
    console.error('Socket connection not initialized.');
  }
};

module.exports = { socketConnection, updateData };
