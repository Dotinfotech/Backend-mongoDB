/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Insert seed models below
var user_model_1 = require("../models/user.model");
// Create Default Admin
var admin = new user_model_1.default({
    first_name: 'Admin',
    last_name: 'now',
    user_name: "admin",
    email: 'admin@dot.com',
    role: 'admin',
    password: '123456',
    provider: 'local',
    phone_number: '9898245452',
    is_verify: true
});
user_model_1.default.create(admin, function (err, user) {
    if (err) {
        console.log("Error creating default admin : " + err);
    }
    else {
        console.log("Default Admin Created");
    }
});
