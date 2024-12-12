require('dotenv').config();
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const { join } = require('node:path');
const http = require('http');
const port = process.env.PORT || 80;



const app = express();
const server = http.createServer(app);
const io = new Server(server);



//middleware
app.use(express.static(path.join(__dirname, '../src/views')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));


//default route
app.get('/', (req, res) =>{
    res.render('chat', { title : 'MazChat'});
});


//user connet and disconnect
io.on('connect', (socket) =>{
    console.log('a user connected');

    //receive message on client
    socket.on('message', (msgFromClient) => {
      //broadcast
      const { id, message } = msgFromClient;
      socket.broadcast.emit('message', id, message);
      console.log(`id : ${id} message : ${message} `);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
});





server.listen(port, () => {
    console.log(`App listen on port ${port}`);
})