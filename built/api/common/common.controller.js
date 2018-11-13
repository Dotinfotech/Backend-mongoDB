"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var mongoose = require("mongoose");
var validator = require("validator");
var async = require("async");
var common_1 = require("../../common/common");
// Get list of things
function get(req, res) {
    var col = req.params.collection;
    var Model = mongoose.model(req.params.collection);
    Model.find({ $and: [{ $or: [{ is_deleted: false }, { is_deleted: null }] }] }, function (err, annos) {
        if (err) {
            res.send(common_1.send_response(null, true, common_1.parse_error(err)));
        }
        else {
            res.send(common_1.send_response(annos));
        }
    });
}
exports.get = get;
;
// Get a single thing
function getById(req, res) {
    var Model = mongoose.model(req.params.collection);
    var json = { _id: req.params.id };
    if (req.params.collection === 'User') {
        var bl = validator.isEmail(req.params.id);
        if (bl === true) {
            json = { _id: req.params.id };
        }
    }
    Model.findOne(json, function (err, annos) {
        if (err) {
            res.send(common_1.send_response(null, true, common_1.parse_error(err)));
        }
        else {
            res.send(common_1.send_response(annos));
        }
    });
}
exports.getById = getById;
;
function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
exports.cleanArray = cleanArray;
;
/* Get list of things according to user */
function getByUser(req, res) {
    var col = req.params.collection;
    var Model = mongoose.model(req.params.collection);
    var where_cond = { $and: [{ $or: [{ is_deleted: false }, { is_deleted: null }] }, { user: req.params.user }] };
    Model.find(where_cond, function (err, annos) {
        if (err) {
            res.send(common_1.send_response(null, true, err));
        }
        else {
            res.send(common_1.send_response());
        }
    });
}
exports.getByUser = getByUser;
;
// Creates a new thing in the DB.
function createnew(req, res) {
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    var Model = mongoose.model(req.params.collection);
    var data = new Model(req.body);
    Model.create(data, function (err, mod) {
        if (err) {
            res.send(common_1.send_response(null, true, common_1.parse_error(err)));
        }
        else {
            if (req.params.collection === "Activity" || req.params.collection === "Comments") {
                Model.findOne({ "_id": mod._id })
                    .populate('user')
                    .exec(function (err, mod) {
                    res.send(common_1.send_response(mod));
                });
            }
            else {
                res.send(common_1.send_response(mod));
            }
        }
    });
}
exports.createnew = createnew;
;
// Creates a new thing in the DB.
function createFromArray(req, res) {
    var Model = mongoose.model(req.params.collection);
    var data = req.body;
    var res_data = [];
    var all_errors = [];
    async.eachSeries(data, function (item, callback) {
        var item_data = new Model(item);
        Model.create(item_data, function (err, mod) {
            if (err) {
                all_errors.push(err);
                callback(null, item);
            }
            else {
                res_data.push(mod);
                callback(null, item);
            }
        });
    }, function done() {
        if (all_errors.length > 0) {
            res.send(common_1.send_response(null, true, all_errors));
        }
        else {
            res.send(common_1.send_response(res_data));
        }
    });
}
exports.createFromArray = createFromArray;
;
// Updates an existing thing in the DB.
function update(req, res) {
    //    if(!req.body.user){
    //        req.body.user = req.user._id;
    //    }
    var Model = mongoose.model(req.params.collection);
    var id = req.params.id;
    if (!id) {
        id = req.body._id;
    }
    if (req.body._id) {
        delete req.body._id;
    }
    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            return;
        }
        if (!thing) {
            res.send(common_1.send_response(null, true, "ERROR_NO_DATA"));
            return;
        }
        //var updated = _.merge(thing, req.body);
        var updated = _.assign(thing, req.body);
        if (!updated) {
            res.send(common_1.send_response(null, true, "ERROR_NO_DATA"));
            return;
        }
        updated.save(function (err) {
            if (err) {
                res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            }
            else {
                if (req.params.collection === "Activity") {
                    Model.findOne({ "_id": thing._id })
                        .populate('user')
                        .exec(function (err, thing) {
                        res.send(common_1.send_response(thing));
                    });
                }
                else {
                    res.send(common_1.send_response(thing));
                }
            }
        });
    });
}
exports.update = update;
;
function putOrPost(req, res) {
    //req.body.user = req.user._id;
    if (req.body._id) {
        exports.update(req, res);
    }
    else {
        exports.createnew(req, res);
    }
}
exports.putOrPost = putOrPost;
;
function softdestroy(req, res) {
    var Model = mongoose.model(req.params.collection);
    var notificationModel = mongoose.model('Notification');
    var id = req.params.id;
    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(common_1.send_response(null, true, common_1.parse_error(err)));
        }
        if (!thing) {
            res.send(common_1.send_response(null, true, "ERROR_NO_DATA"));
        }
        thing.is_deleted = true;
        if (req.params.collection == 'Activity') {
            thing.user.tot_activities = (thing.user.tot_activities - 1) > 0 ? thing.user.tot_activities - 1 : 0;
            thing.user.save(function (err) {
                notificationModel.find({ "content_id": thing._id }, function (err, notis) {
                    if (err) {
                        console.log(common_1.parse_error(err));
                    }
                    else {
                        if (notis != null) {
                            async.eachSeries(notis, function (noti, loopCallback) {
                                if (noti != null) {
                                    noti.is_deleted = true;
                                    noti.save(function (err) {
                                        loopCallback();
                                    });
                                }
                                else {
                                    loopCallback();
                                }
                            }, function (error, rest) {
                                console.log('Notification deleted');
                            });
                        }
                    }
                });
            });
        }
        thing.save(function (err) {
            if (err) {
                res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            }
            else {
                res.send(common_1.send_response(thing));
            }
        });
    });
}
exports.softdestroy = softdestroy;
;
// Deletes a thing from the DB.
function destroy(req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.findById(req.params.id, function (err, thing) {
        if (err) {
            return res.send(common_1.send_response(null, true, common_1.parse_error(err)));
        }
        if (!thing) {
            return res.send(common_1.send_response(null, true, "ERROR_NO_DATA"));
        }
        thing.remove(function (err) {
            if (err) {
                return res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            }
            return res.status(204).send(common_1.send_response({}));
        });
    });
}
exports.destroy = destroy;
;
/**
 * limit = {skip:0, limit:10}
 * sort = {"fild_name" : -1/1}
 * search_by = {"keyword":"name", "field" : "username"}
 * */
function executeQuery(req, res) {
    var Model = mongoose.model(req.params.collection);
    var where = req.body.where || {};
    var populate = req.body.populate;
    var fields = req.body.fields;
    var sort = req.body.sort;
    var limit = req.body.limit;
    var in_cls = req.body.in;
    var count = req.body.count;
    var search_by = req.body.search_by;
    console.log(sort);
    if (!common_1.isEmpty(where) && !common_1.isEmpty(in_cls)) {
        res.send(common_1.send_response(null, true, "You can not send both WHERE and IN condition togather."));
        return;
    }
    if (!fields) {
        fields = '';
    }
    if (req.params.collection === 'User') {
        fields = fields + " -hashedPassword -salt";
    }
    if (req.params.collection === 'User' && !common_1.isEmpty(search_by) && search_by.keyword) {
        if (typeof search_by.keyword == 'object') {
            async.eachSeries(search_by.keyword, function (item, callback) {
                where["$or"] = [{ "first_name": new RegExp('^' + item + '*', "i") }, { "last_name": new RegExp('^' + item + '*', "i") }, { "user_name": new RegExp('^' + item + '*', "i") }];
                callback(null, item);
            }, function done() {
            });
        }
        else if (!common_1.isEmpty(search_by) && search_by.keyword && search_by.field) {
            where[search_by.field] = new RegExp('^' + search_by.keyword + '*', "i");
        }
    }
    else if (!common_1.isEmpty(search_by) && search_by.keyword && search_by.field) {
        where[search_by.field] = new RegExp('^' + search_by.keyword + '*', "i");
    }
    var query = Model.find({ $or: [{ is_deleted: false }, { is_deleted: null }] }, fields);
    if (!common_1.isEmpty(where)) {
        query = Model.find(where, fields);
    }
    if (!common_1.isEmpty(in_cls)) {
        var temp = {};
        temp[in_cls.key] = {
            $in: in_cls.val
        };
        query = Model.find(temp, fields);
    }
    if (populate) {
        query = query.populate(populate);
    }
    if (sort) {
        query = query.sort(sort);
    }
    if (!common_1.isEmpty(limit)) {
        query = query.skip(limit.skip).limit(limit.limit);
    }
    if (count === true) {
        query.count().exec(function (err, annos) {
            if (err) {
                res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            }
            else {
                console.log(1111);
                console.log(annos);
                res.send(common_1.send_response(annos));
            }
        });
    }
    else {
        query.exec(function (err, annos) {
            if (err) {
                res.send(common_1.send_response(null, true, common_1.parse_error(err)));
            }
            else {
                res.send(common_1.send_response(annos));
            }
        });
    }
}
exports.executeQuery = executeQuery;
;
function metadata(req, res) {
    console.log(req);
    var Model = mongoose.model(req.params.collection);
    var paths = Model.schema.paths;
    var keys = Object.keys(Model.schema.paths);
    var retval = [];
    keys.forEach(function (key) {
        if (key !== "__v") {
            var obj = paths[key];
            if (key === '_id') {
                var str = "<key>entity_id</key><string>_id</string>";
                retval.push(str);
            }
            else {
                var str = "<key>" + key + "</key><string>" + key + "</string>";
                retval.push(str);
            }
        }
    });
    res.setHeader('content-type', 'application/xml');
    res.send(retval.join("\n"));
}
exports.metadata = metadata;
;
