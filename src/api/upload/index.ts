'use strict';

import * as express from 'express';

import * as multer from 'multer';
var upload = multer({dest: 'public/upload/'})

import * as controller from './upload.controller';
import * as config from '../../config/environment';
import * as auth from '../../auth/auth.service';
    
var router = express.Router();

router.post('/upload/singleimg', auth.isAuthenticated(), upload.single('file'), controller.uploadFile);
router.post('/upload/:collection/:id', auth.isAuthenticated(), upload.single('file'), controller.uploadimage);
router.post('/remove/:filename', auth.isAuthenticated(), controller.removeFile);
router.get('/get/:filename', controller.image);

module.exports = router;