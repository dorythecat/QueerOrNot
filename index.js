const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const maxPairedTime = 60 * 1000; // 1 minute in ms

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/res'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];
let unpairedUsers = [];
let pairs = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  users.push(socket.id);
  unpairedUsers.push(socket.id);
  if (unpairedUsers.length >= 2) {
    const user1 = unpairedUsers.shift();
    const user2 = unpairedUsers.shift();
    pairs.push({ user1, user2 });
    io.to(user1).emit('pair', { partnerId: user2 });
    io.to(user2).emit('pair', { partnerId: user1 });
    console.log(`Paired ${user1} with ${user2}`);
    setTimeout(() => {
      // Automatically unpair after maxPairedTime if they are still paired
      const pairIndex = pairs.findIndex(pair => pair.user1 === user1 && pair.user2 === user2);
      if (pairIndex !== -1) {
        pairs.splice(pairIndex, 1);
        unpairedUsers.push(user1, user2);
        io.to(user1).emit('unpair', {});
        io.to(user2).emit('unpair', {});
        console.log(`Unpaired ${user1} and ${user2} (timeout)`);
      }
    }, maxPairedTime);
  }
  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter(user => user !== socket.id);
    unpairedUsers = unpairedUsers.filter(user => user !== socket.id);
    pairs = pairs.filter(pair => {
      if (pair.user1 === socket.id || pair.user2 === socket.id) {
        const otherUser = pair.user1 === socket.id ? pair.user2 : pair.user1;
        unpairedUsers.push(otherUser);
        io.to(otherUser).emit('unpair', {});
        console.log(`Unpaired ${socket.id} and ${otherUser} (disconnected)`);
        return false; // Remove this pair
      } return true; // Keep this pair
    });
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    console.log('isQueer: ' + socket.handshake.query.isQueer);
    console.log('user id: ' + socket.id);
    console.log('users: ', users);
    console.log('unpairedUsers: ', unpairedUsers);
    console.log('pairs: ', pairs);
    // Broadcast the message to the paired user
    const pair = pairs.find(pair => pair.user1 === socket.id || pair.user2 === socket.id);
    if (pair) {
      const partnerId = pair.user1 === socket.id ? pair.user2 : pair.user1;
      io.to(partnerId).emit('chat message', msg, socket.handshake.query.isQueer);
    }
  });
});

server.listen(8080, () => {
  console.log('listening on *:8080');
  console.log('Open http://localhost:8080 in your browser to test the app');
});
