"use strict";
/**
 * Main application file
 */
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Loading ... ");
'use strict';
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.TZ = 'Asia/Kolkata';
var express = require("express");
var mongoose = require("mongoose");
var environment_1 = require("./config/environment");
var cors = require("cors");
var http_mod = require("http");
var socketIo_mod = require("socket.io");
var usernames = {};
var server = new http_mod.Server(express);
var io = socketIo_mod(server);
// Connect to database
mongoose.connect(environment_1.default.mongo.uri);
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});
// Populate DB with sample data
if (environment_1.default.seedDB) {
    require('./config/seed');
}
// Setup server
var app = express();
var http = require("http");
var server = http.createServer(app);
var socketIo = require("socket.io");
var socketio = new socketIo(server, {
    serveClient: environment_1.default.env !== 'production',
    path: '/socket.io'
});
//console.log(socketio);
//var io = new Server();
//import * as p2p from 'socket.io-p2p-server'.Server;
//socketio.use(p2p);
function logger(req, res, next) {
    //    console.log(new Date(), req.method, req.url);
    //    console.log(req.hostname);
    // attach companyid in req
    var cid = req.get('companyId');
    if (cid && cid !== null && cid !== undefined && cid !== "null") {
        req.companyId = cid;
    }
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    // headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, companyId";//"Content-Type, Accept";//
    headers['Access-Control-Allow-Headers: Authorization, Content-Type'];
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        res.writeHead(200, headers);
        //res.end();
        res.send();
    }
    else {
        next();
    }
}
app.use(cors());
//app.use(logger);
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./models')(app, mongoose);
require('./routes')(app);
require('./common/common');
function checkAuth(err, req, res, next) {
    if (err.name.indexOf('Unauthorized') !== -1) {
        res.status(401);
        res.send({ data: null, is_error: true, message: "Unauthorized Request, Please sign in first." });
    }
    else {
        return next();
    }
}
app.use(checkAuth);
// Start server
server.listen(environment_1.default.port, environment_1.default.ip, function () {
    console.log('Express server listening on %d, in %s mode', environment_1.default.port, app.get('env'));
});
io.sockets.on('connection', function (socket) {
    console.log("Socket connection");
});
// Expose app
exports.default = app;
