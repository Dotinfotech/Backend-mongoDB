'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as config from '../config/environment';
import * as User from '../models/user.model';
import * as acl from "express-acl";

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