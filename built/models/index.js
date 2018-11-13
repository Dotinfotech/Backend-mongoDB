"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
module.exports = function (app, mongoose) {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file == "index.js")
            return;
        var name = file.substr(0, file.lastIndexOf('.'));
        (function (name) { return require('./' + name)(app, mongoose); });
    });
};
// Anuj, 15:28import fs from 'fs';
// // get local files
// const files = fs.readdirSync('./test');
// // require and execute each
// files.forEach(file => require('./test/' + file)(
