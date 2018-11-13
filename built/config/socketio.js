/**
 * Socket.io configuration
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// When the user disconnects.. perform this
function onDisconnect(socket) {
}
// When the user connects.. perform this
function onConnect(socket) {
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });
    // Insert sockets below
    //  require('../api/thing/thing.socket').register(socket);
}
var rooms = [];
var usernames = {};
module.exports = function (socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"
    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    // socketio.use(require('socketio-jwt').authorize({
    //   secret: config.secrets.session,
    //   handshake: true
    // }));
    socketio.on('connection', function (socket) {
        socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;
        socket.connectedAt = new Date();
        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket);
            console.info('[%s] DISCONNECTED', socket.address);
        });
        socket.on('adduser', function (data) {
            //            console.log(data.username);
            var username = data.username;
            var room = data.room;
            if (rooms.indexOf(room) != -1) {
                socket.username = username;
                socket.room = room;
                usernames[username] = username;
                socket.join(room);
                socket.emit('updatechat', 'INFO', 'START');
                socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
                console.log(username + "has connected to this room");
            }
            else {
                console.log("Please enter valid code.");
                socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
            }
        });
        socket.on('createroom', function (data) {
            var new_room = data.id;
            console.log(new_room);
            rooms.push(new_room);
            data.room = new_room;
            socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
            socket.emit('roomcreated', data);
        });
        socket.on('sendchat', function (data) {
            //            console.log(data);
            //            var sendChat = {
            //                "message": data.message,
            //                "to_user": data.to_user,
            //                "from_user": data.from_user
            //            };
            console.log(data);
            socket.in(data.to_user).emit('updatechat', socket.username, data);
        });
        // Call onConnect.
        onConnect(socket);
        console.info('[%s] CONNECTED', socket.address);
    });
};
