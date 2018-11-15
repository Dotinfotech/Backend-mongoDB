'use strict';

import * as express from 'express';
import * as controller from './user.controller';
import * as config from '../../config/environment';
import * as auth from '../../auth/auth.service';

var router = express.Router();
import * as multer from 'multer';
var upload = multer({dest: './public/upload/'});

router.post('/register', controller.register_user);
router.post('/forgotpassword', controller.forgotpassword);
router.post('/register_verify', controller.register_verify);
router.post('/resetPassword', controller.resetPassword);
router.post('/welcome_user', controller.welcome_user);
router.post('/verifytoken', controller.verifytoken);
router.post('/updatepassword', auth.isAuthenticated(), controller.updatePassword);

/* For mobile side */
router.post('/upload/avatar', auth.isAuthenticated(), upload.single('file'), controller.uploadpic);
/* END */

export = router;