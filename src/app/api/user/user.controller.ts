import * as _ from "lodash";
import * as async from "async";
import * as passport from "passport";
import * as mongoose from "mongoose";
import * as crypto from "crypto";
import * as sgMail from "@sendgrid/mail";
import * as auth from "../../auth/auth.service";
import { default as config } from "../../config/local.env";
import { send_response, parse_error } from "../../common/common";
import * as dotenv from "dotenv";
dotenv.config();

//sendGrid api key

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* Update password from admin panel */
export function updatePassword(req, res) {
  var User = mongoose.model("User");
  console.log("user: " + User);
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) {
      res.send(send_response(null, true, "User not found!"));
    } else {
      if (
        !req.body.old_password ||
        !req.body.new_password ||
        !req.body.confirm_password
      ) {
        res.send(
          send_response(
            null,
            true,
            "Please enter your old password and new password"
          )
        );
      } else {
        var isAuth = user.authenticate(req.body.old_password);
        if (isAuth === true) {
          if (req.body.new_password !== req.body.confirm_password) {
            res.send(
              send_response(
                null,
                true,
                " New password and Confirm password do not match, try again!"
              )
            );
          } else {
            user.password = req.body.new_password;
            user.save(function(err, saved) {
              if (err) {
                res.send(send_response(null, true, parse_error(err)));
              } else {
                res.send(send_response(null, false, "password updated!"));
              }
            });
          }
        } else {
          res.send(send_response(null, true, "Old password is wrong!"));
        }
      }
    }
  });
}

/* Verify token whether token exist in forgot password model or changed */
export function verifytoken(req, res) {
  var ForgotPassword = mongoose.model("Forgotpassword");
  var data = req.body;
  ForgotPassword.findOne({ token: data.token }, function(err, user) {
    if (user == null) {
      res.json({ data: null, is_error: true, message: "Token invalid!" });
    } else if (user.is_changed == true) {
      res.json({
        data: user,
        is_error: true,
        message: "This link is no longer available.Please request a new link!"
      });
    } else {
      res.json({ data: user, is_error: false, message: "Valid token!" });
    }
  });
}

/* Forgot password api for sending mail with link */
export function forgotpassword(req, res) {
  var User = mongoose.model("User");
  var ForgotPassword = mongoose.model("Forgotpassword");
  var data = req.body;

  User.findOne({ email: data.email }, function(err, user) {
    if (user == null) {
      res.json({ data: null, is_error: true, message: "User not found!" });
    } else {
      var today = new Date();
      //Generate Hash
      var secret = "a3s5d46a5sd684asdaasdkn!@312";
      var hash = crypto
        .createHmac("sha256", secret)
        .update(user._id + user.email + user._id + today)        
        .digest("hex");

      var email_data = {
        user: user._id,
        token: hash
      };

      var email_data = new ForgotPassword(email_data, function(err) {
        if (err) {
          console.log("data not pushed in database");
        } else res.send(send_response(null, false, "Data pushed in database!"));
      });

      ForgotPassword.create(email_data, function(error, data) {
        var mail_data = {
          to: user.email,
          from: process.env.EMAIL_ID,
          subject: "Forgot Password",
          text:
            "Click the following link to reset the password: " +
            config.CLIENT_URL +
            "/resetPassword?token=" +
            hash
        };
        sgMail.send(mail_data).then(sent => {
          if (sent) {
            res.json({ data: null, is_error: false, message: "Mail sent!" });
          } else {
            res.json({
              data: null,
              is_error: true,
              message: "Mail sending failed!"
            });
          }
        });

        res.json({ data: user, is_error: false });
      });
    }
  });
}

/** Reset Password **/
export function resetPassword(req, res) {
  var User = mongoose.model("User");
  var Forgotpassword = mongoose.model("Forgotpassword");
  var params = req.body;

  console.log("params: " + params);

  if (!params || !params.token || !params.new_password) {
    res.send(send_response(null, true, "Validation error!"));
  } else {
    if (params.new_password.length <= 5) {
      res.send(
        send_response(null, true, "Password must be of minimum 6 characters!")
      );
    } else {
      Forgotpassword.findOne({ token: params.token }).exec(function(
        err,
        forgot
      ) {
        if (err) {
          res.send(send_response(null, true, err.message));
        } else {
          console.log("forgot: " + forgot.user);
          User.findOne({ _id: forgot.user }).exec(function(err, user) {
            if (err) {
              res.send(send_response(null, true, err.message));
            } else {
              if (user) {
                if (!params.new_password || !params.confirm_password) {
                  res.send(
                    send_response(
                      null,
                      true,
                      "Please enter new_password and/or confirm_password"
                    )
                  );
                } else {
                  if (params.new_password !== params.confirm_password) {
                    res.send(
                      send_response(
                        null,
                        true,
                        "Password do not match. Try again!"
                      )
                    );
                  } else {
                    user.password = params.new_password;
                    console.log("user.password is(changed):" + user.password);
                    user.save(function(err, user) {
                      if (err) {
                        res.send(send_response(null, true, err.message));
                      } else {
                        forgot.is_changed = true;
                        forgot.save(function(err, user) {
                          if (err) {
                            res.send(send_response(null, true, err.message));
                          } else {
                            // remove model object from user
                            user = user.toJSON();
                            // delete password key
                            delete user.password;
                            res.send(
                              send_response(
                                null,
                                false,
                                "Your password is changed successfully now you can login with new password from the app."
                              )
                            );
                            // res.send(send_response(user, false, "password changed!"));
                            console.log("Password successfully changed!!");
                          }
                        });
                      }
                    });
                  }
                }
              } else {
                res.send(send_response(null, true, "User not found!"));
              }
            }
          });
        }
      });
    }
  }
}

/* Verification api after user register from website */
export function register_verify(req, res) {
  var User = mongoose.model("User");
  var data = req.body;
  User.findOne({ email: data.email }, function(err, user) {
    if (user == null) {
      res.json({ data: null, is_error: true, message: "Invalid user detail!" });
    } else {
      var today = new Date();
      //Generate Hash
      var secret = "a3s5d46a5sd684asdaasdkn!@312";
      var hash = crypto
        .createHmac("sha256", secret)
        .update(user._id + user.email + user._id + today)
        .digest("hex");

      var mail_data = {
        to: user.email,
        from: process.env.EMAIL_ID,
        subject: "Register Verify",
        text: "Your email is verified"
      };
      sgMail.send(mail_data).then(sent => {
        if (sent) {
          res.json({ data: null, is_error: false, message: "Mail sent!" });
        } else {
          res.json({
            data: null,
            is_error: true,
            message: "Mail sending failed!"
          });
        }
      });
    }
  });
}

/* Mail to user for welcoming after registration */
export function welcome_user(req, res) {
  var User = mongoose.model("User");
  var data = req.body;
  User.findOne({ email: data.email }, function(err, user) {
    if (user == null) {
      res.json({ data: null, is_error: true, message: "Invalid user!" });
    } else {
      user.is_verify = true;
      user.save(function(err) {
        if (err) {
          res.send(send_response(null, true, parse_error(err)));
        } else {
          var today = new Date();
          //Generate Hash
          var secret = "a3s5d46a5sd684asdaasdkn!@312";
          var hash = crypto
            .createHmac("sha256", secret)
            .update(user._id + user.email + user._id + today)
            .digest("hex");

          var mail_data = {
            to: user.email,
            from: process.env.EMAIL_ID,
            subject: "Welcome!",
            text: "Welcome " + user.first_name
          };
          sgMail.send(mail_data).then(sent => {
            if (sent) {
              res.json({ data: null, is_error: false, message: "Mail sent!" });
            } else {
              res.json({
                data: null,
                is_error: true,
                message: "Mail sending failed!"
              });
            }
          });
        }
      });
    }
  });
}

/* Register user api from app */
export function register_user(req, res) {
  var Model = mongoose.model("User");
  var data = req.body;
  console.log("password: " + data.password);
  if (!data.email || !data.password || !data.confirm_password) {
    res.send(
      send_response(
        null,
        true,
        "Please enter email and password and confirm password"
      )
    );
  } else {
    if (data.password !== data.confirm_password) {
      res.send(send_response(null, true, "passwords do not match!"));
    } else {
      Model.create(data, function(err, user) {
        if (err) {
          console.log("asaaaa");
          res.send(send_response(null, true, parse_error(err)));
        } else {
          console.log("Asda");
          var today = new Date();
          //Generate Hash
          var secret = "a3s5d46a5sd684asdaasdkn!@312";
          var hash = crypto
            .createHmac("sha256", secret)
            .update(user._id + user.email + user._id + today)
            .digest("hex");

          var mail_data = {
            to: user.email,
            from: process.env.EMAIL_ID,
            subject: "Welcome " + user.first_name + "!",
            text: "Welcome to our website!"
          };
          sgMail.send(mail_data).then(sent => {
            if (sent) {
              res.json({ data: null, is_error: false, message: "Mail sent!" });
            } else {
              res.json({
                data: null,
                is_error: true,
                message: "Mail sending failed!"
              });
            }
          });
          var token = auth.signToken(user._id, user.role);
          var data = { user: user };
          res.send(
            send_response(
              null,
              true,
              "Register success. please check your inbox"
            )
          );
        }
      });
    }
  }
}

/**
 * User profile pic change API
 * @param req
 * @param res
 */
export function uploadpic(req, res) {
  var Model = mongoose.model("User");
  Model.findOne({ _id: req.user._id }, function(err, mod) {
    if (err) {
      res.send(send_response(null, true, "Could not find User"));
    } else {
      if (req.file) {
        mod.avatar = req.file.filename;

        mod.save(function(err, obj) {
          if (err) {
            res.send(send_response(null, true, "Could not save file"));
          } else {
            res.send(send_response(null, false, obj));
          }
        });
      } else {
        res.send(send_response(null, true, "Please select the file!"));
      }
    }
  });
}
