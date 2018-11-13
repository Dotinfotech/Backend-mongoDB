'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var autopopulate = require("mongoose-autopopulate");
var Schema = mongoose.Schema;
var crypto = require("crypto");
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var mongoH = require("mongoose-hidden");
var mongooseHidden = (mongoH)({ defaultHidden: { password: true } });
var schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};
var UserSchema = new Schema({
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    user_name: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    is_verify: { type: Boolean, default: false },
    email: { type: String, lowercase: true },
    phone_number: { type: String, default: null },
    avatar: { type: String, default: '' },
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: { type: String, hide: true },
    salt: { type: String, hide: true },
    provider: String,
    create_date: { type: Date, default: Date.now },
    last_updated: { type: Date, default: null },
    last_login: { type: Date, default: null },
}, schemaOptions);
UserSchema.plugin(autopopulate);
UserSchema.plugin(mongooseHidden);
/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
})
    .get(function () {
    return this._password;
});
// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
    console.log("Proooo");
    return {
        'name': this.name,
        'role': this.role
    };
});
UserSchema
    .virtual('full_name')
    .get(function () {
    if (this.first_name == '' && this.last_name == '') {
        return this.user_name;
    }
    else {
        return this.first_name + ' ' + this.last_name;
    }
});
// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
    return {
        '_id': this._id,
        'role': this.role
    };
});
/**
 * Validations
 */
UserSchema
    .path('email')
    .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1)
        return true;
    return email.length;
}, 'Email cannot be blank');
// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1)
        return true;
    return hashedPassword.length;
}, 'Password cannot be blank');
UserSchema
    .path('email')
    .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({ email: value }, function (err, user) {
        if (err)
            throw err;
        if (user) {
            if (self.id === user.id)
                return respond(true);
            return respond(false);
        }
        respond(true);
    });
}, 'Email already in use');
var validatePresenceOf = function (value) {
    return value && value.length;
};
UserSchema
    .post('init', function (model) {
    this.wasNew = this.isNew;
});
/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
    this.last_updated = new Date();
    this.wasNew = this.isNew;
    if (this.settings) {
        this.setting = this.settings;
    }
    if (!this.isNew) {
        return next();
    }
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});
/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt)
            return '';
        var salt = new Buffer(this.salt, 'base64');
        try {
            var pwd = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        }
        catch (e) {
            console.log(e);
        }
        return pwd;
    }
};
exports.default = mongoose.model('User', UserSchema);
