import * as _ from 'lodash';
import * as mongoose from "mongoose";
import * as path from 'path';
import * as fs from 'fs';
import { send_response } from '../../common/common'


export function uploadFile (req, res) {
    res.send(send_response(req.file.filename, false, "File uploaded"));
}

export function removeFile (req, res) {
    var filepath = path.join('public/upload/', req.params.filename);
    fs.exists(filepath, function (exists) {
        if (exists) {
            fs.unlink(filepath, function () {
                res.send(send_response(null, true, 'File exists'));
            });
        } else {
            res.send(send_response(null, true, "File not exists"));
        }
    });
}

// Get list of things
export function uploadimage (req, res) {    
    var Model = mongoose.model(req.params.collection);
    Model.findOne({_id: req.params.id}, function (err, mod) {
        if (err) {
            console.log(err);
            res.send(send_response(null, true, "Could not find " + req.params.collection));
        } else {
            var field = req.body.field;
            if(req.params.collection == 'Activity'){
                mod.images.push(req.file.filename);
            } else {
                mod[field] = req.file.filename;
            }
            mod.save(function (err, obj) {
                if (err) {
                    console.log(err);
                    res.send(send_response(null, true, "Could not save file"));
                } else {
                    res.send(send_response(null, false, obj));
                }
            });
        }
    });
};

export function image (req, res) {
    var filepath = path.join('public/upload/', req.params.filename);
    fs.stat(filepath, function (err, stat) {
        if (err == null) {
            console.log('File exists');
            fs.createReadStream(filepath).pipe(res)
        } else if (err.code == 'ENOENT') {
            console.log('File Not exists');
            // file does not exist
            //fs.writeFile('log.txt', 'Some log\n');
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}