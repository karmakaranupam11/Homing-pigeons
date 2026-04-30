const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const Filter = require('bad-words')
const { generateMessage , generateLocation } = require('./utils/message')
const { addusr, removeusr, getusr, getusrinroom, capitalizeFirstLetter, getActiveRooms, roomExists } = require('./utils/users')

const app = express()
const server = http.createServer(app) // we need to do this as socket io need the http server
const io = socketio(server)

const port = process.env.PORT || 4040;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

// REST endpoint: returns list of active room IDs
app.get('/api/rooms', (req, res) => {
    res.json({ rooms: getActiveRooms() });
});


io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.on('join', (obj, callback) => {
        // If joining an existing room, check it exists first
        if (obj.isNew !== 'true' && !roomExists(obj.room)) {
            return callback('Room not found. Please check the Room ID or create a new room.');
        }

        const { error, user } = addusr({
            id: socket.id,
            username: obj.username,
            room: obj.room
        })

        if (error) {
            return callback(error);
        }
        else {
            // formatting 
            obj.username = capitalizeFirstLetter(obj.username);
            
            socket.join(obj.room);
            socket.emit('userdetails',{user : obj.username});
            socket.emit('joiningMessage', generateMessage(obj.username ,`You joined the chat`));
            socket.broadcast.to(obj.room).emit('joiningMessage', generateMessage(obj.username,`${obj.username} joined the chat`));
            
            io.to(obj.room).emit('roomData',{
                room: obj.room,
                users : getusrinroom(obj.room)
            })
            
            callback()
        }

    })

    //for sending message
    socket.on('messageon', (messagetext, callback) => {
        
        const user = getusr(socket.id); 
        const filter = new Filter();

        if (filter.isProfane(messagetext)) {
            socket.emit('badLanguageAlert', generateMessage(user.username,"Your message contains disrespectful words!"));
            return callback('Profanity is not allowed');
        }
        // error
        socket.emit('Incoming', generateMessage(user.username ,messagetext));
        socket.broadcast.to(user.room).emit('Outgoing', generateMessage(user.username,messagetext));
        callback();// for acknowledgement
    })


    socket.on('sendLocation', (longlat, callback) => {
        const user = getusr(socket.id);
        socket.emit('IncomingPosition', generateLocation(user.username,`https://google.com/maps?q=${longlat.latitude},${longlat.longitude}`));
        socket.broadcast.to(user.room).emit('OutgoingPosition',generateLocation(user.username,`https://google.com/maps?q=${longlat.latitude},${longlat.longitude}`));
        callback();
    })

    socket.on('sendGif', (gifUrl, callback) => {
        const user = getusr(socket.id);
        if(user) {
            socket.emit('IncomingGif', generateMessage(user.username, gifUrl));
            socket.broadcast.to(user.room).emit('OutgoingGif', generateMessage(user.username, gifUrl));
        }
        if(callback) callback();
    })

    socket.on('disconnect', () => {
        const user = removeusr(socket.id);
        if (user) {
            io.to(user.room).emit('disconnectionMessage', generateMessage(user.username,`the ${user.username} left the chat`));
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getusrinroom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log("the server is listning at port " + port);
})

