"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateDateRangeDict = function () {
    var date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    var dates = {};
    while (date < new Date()) {
        var dateString = date.toISOString().split('T')[0];
        dates[dateString] = 0;
        date.setDate(date.getDate() + 1);
    }
    return dates;
};
exports.default = generateDateRangeDict;
