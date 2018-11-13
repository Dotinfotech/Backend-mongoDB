/**
 * Main application routes
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app) {
    // Insert routes below
    //   app.use('/api/image', require('./api/upload'));
    app.use('/api/user', require('./api/user'));
    app.use('/api/query', require('./api/common'));
    app.use('/auth', require('./auth'));
};
