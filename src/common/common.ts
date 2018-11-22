import * as _ from 'lodash';
import * as fs from 'fs';

export function send_response (data?:any, is_error?:any, message?:any) {
    var json = {data: data, is_error: is_error, message: message};
    if (is_error === undefined) {
        json.is_error = false;
    }
    if (message === undefined) {
        json.message = '';
    }

    return json;
};

export function parse_error (err) {
    var keys = _.keys(err.errors);
    var messages = [];
    if (err.errors) {
        keys.forEach(function (key) {
            var obj = err.errors[key];
            messages.push(obj.message);
        });
    } else {
        messages.push(err.message);
    }

    if (messages.length > 0) {
        return messages[0];
    } else {
        return "";
    }

};

/*
 * Check JSON object is empty or not
 * @param {type} obj
 * @returns {Boolean}
 */
export function isEmpty (obj) {
    // null and undefined are "empty"
    if (obj == null)
        return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }

    return true;
}


export function convertToBase64(url) {
    var finalBase64 = "";
   // var image_origial = "app/templates/img/icon/facebook.png";
    fs.readFile(url, function(err, original_data){
        if(!err){
            let token = original_data.toString('base64');
            var base64Image = new Buffer(token, 'binary');
            var finalBase64 = "data:image/png;base64," + base64Image;
            //console.log(finalBase64);
            return finalBase64;
        }else {
            return false;
        } 
    });
}

