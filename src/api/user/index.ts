"use strict";

import * as express from "express";
import * as controller from "./user.controller";
import * as config from "../../config/environment";
import * as auth from "../../auth/auth.service";
import * as acl from "express-acl";

let options = {
  path: "src/config/",
  baseUrl: "/",
  defaultRole: "user"
};

acl.config(options);

var router = express.Router();
import * as multer from "multer";
var upload = multer({ dest: "./public/upload/" });
router.use(acl.authorize);

router.post("/register", controller.register_user);
router.post("/forgotpassword", controller.forgotpassword);
router.post("/register_verify", controller.register_verify);
router.post("/resetPassword", controller.resetPassword);
router.post("/welcome_user", controller.welcome_user);
router.post("/verifytoken", controller.verifytoken);
router.post(
  "/updatepassword",
  auth.isAuthenticated(),
  controller.updatePassword
);
router.get("/acl-test", function(req, res) {
  res.send("acl is working!!!");
});

/* For mobile side */
router.post(
  "/upload/avatar",
  auth.isAuthenticated(),
  upload.single("file"),
  controller.uploadpic
);
/* END */

export = router;
