'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controller = require("./user.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: './public/upload/' });
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
module.exports = router;
