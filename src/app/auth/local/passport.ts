import * as passport from 'passport';
import * as local from 'passport-local';
let LocalStrategy = local.Strategy;

export function setup (User, config) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    },
            function (email, password, done) {
                User.findOne({
                    email: email
                }, function (err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        return done(null, false, {message: 'User not registered yet!'});
                    }
                    if (user.is_active === false) {
                        return done(null, false, {message: 'You are deactivated by admin! Please contact admin!'});
                    }
                    if (!user.authenticate(password)) {
                        return done(null, false, {message: 'Invalid username or password!'});
                    }
                    return done(null, user);
                });
            }
    ));
};