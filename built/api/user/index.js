'use strict';
var express = require("express");
var controller = require("./user.controller");
var auth = require("../../auth/auth.service");
var acl = require("express-acl");
var options = {
    path: 'src/app/config',
    baseUrl: ['/'],
    // baseUrl: 'api',
    defaultRole: 'user'
};
acl.config(options);
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
router.get('/acl-test', function (req, res) {
    res.send('acl is working!!!');
});
/* For mobile side */
router.post('/upload/avatar', auth.isAuthenticated(), upload.single('file'), controller.uploadpic);
/* END */
router.use(acl.authorize);
module.exports = router;
