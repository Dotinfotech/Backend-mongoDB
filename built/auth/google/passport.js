"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var google = require("passport-google-oauth");
var GoogleStrategy = google.OAuth2Strategy;
function setup(User, config) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({
            'google.id': profile.id
        }, function (err, user) {
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    username: profile.username,
                    provider: 'google',
                    google: profile._json
                });
                user.save(function (err) {
                    if (err)
                        return done(err);
                    done(err, user);
                });
            }
            else {
                return done(err, user);
            }
        });
    }));
}
exports.setup = setup;
;
