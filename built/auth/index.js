'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var config = require("../config/environment");
var User = require("../models/user.model");
var acl = require("express-acl");
// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);
var router = express.Router();
router.use(acl.authorize);
router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));
module.exports = router;
