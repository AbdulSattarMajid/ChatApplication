const http = require('http');
const express = require('express');
const { log } = require('console');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
    let username = '';
    socket.on('set-username', (name) => {
        username = name;
        io.emit('message', { message: `${username} has joined the chat`, sender: '' });
    });

    socket.on('user-message', (data) => {
        const { message, sender } = data;
        io.emit('message', { message, sender });
    });

    socket.on('disconnect', () => {
        if (username) {
            io.emit('message', { message: `${username} has left the chat`, sender: 'System' });
        }
    });
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => log("Server running on http://localhost:3000"));
