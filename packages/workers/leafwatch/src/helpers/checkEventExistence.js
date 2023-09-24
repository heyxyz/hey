"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkEventExistence = function (obj, event) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            if (checkEventExistence(obj[key], event)) {
                return true;
            }
        }
        else if (obj[key] === event) {
            return true;
        }
    }
    return false;
};
exports.default = checkEventExistence;
