const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('node:fs');

const maxPairedTime = 60 * 1000; // 1 minute in ms
const debugMode = false; // Set to true to enable debug logging
const logFile = 'server.log'; // Log file to store server logs
const port = 8080; // Change this to your desired port

async function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFile(logFile, `[${timestamp}] - ${message}\n`, (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err}`);
    }
  });
  if (debugMode) console.log(`[${timestamp}] - ${message}`);
}

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/res'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];
let unpairedUsers = [];
let pairs = [];

io.on('connection', (socket) => {
  log(`User connected: ${socket.id} from ${socket.handshake.address}`);
  users.push(socket.id);
  socket.on('pair', () => {
    unpairedUsers.push(socket.id);
    if (unpairedUsers.length >= 2) {
      const user1 = unpairedUsers.shift();
      const user2 = unpairedUsers.shift();
      pairs.push({ user1, user2 });
      io.to(user1).emit('pair', { partnerId: user2 });
      io.to(user2).emit('pair', { partnerId: user1 });
      log(`Paired ${user1} with ${user2}`);
      setTimeout(() => {
        // Automatically unpair after maxPairedTime if they are still paired
        const pairIndex = pairs.findIndex(pair => pair.user1 === user1 && pair.user2 === user2);
        if (pairIndex !== -1) {
          pairs.splice(pairIndex, 1);
          unpairedUsers.push(user1, user2);
          io.to(user1).emit('unpair', {});
          io.to(user2).emit('unpair', {});
          log(`Unpaired ${user1} and ${user2} (timeout)`);
        }
      }, maxPairedTime);
    }
  });
  socket.on('disconnect', () => {
    log(`User disconnected: ${socket.id}`);
    users = users.filter(user => user !== socket.id);
    unpairedUsers = unpairedUsers.filter(user => user !== socket.id);
    pairs = pairs.filter(pair => {
      if (pair.user1 === socket.id || pair.user2 === socket.id) {
        const otherUser = pair.user1 === socket.id ? pair.user2 : pair.user1;
        io.to(otherUser).emit('unpair', {});
        log(`Unpaired ${socket.id} and ${otherUser} (disconnected)`);
        return false; // Remove this pair
      } return true; // Keep this pair
    });
  });
  socket.on('chat message', (msg) => {
    log(`Message sent by: ${socket.id} - ${msg}`);
    // Broadcast the message to the paired user
    const pair = pairs.find(pair => pair.user1 === socket.id || pair.user2 === socket.id);
    if (pair) {
      const partnerId = pair.user1 === socket.id ? pair.user2 : pair.user1;
      io.to(partnerId).emit('chat message', msg, socket.handshake.query.isQueer);
    }
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  console.log(`Open http://localhost:${port} in your browser to test the app`);
  log(`Server started on port ${port} successfully`);
});
