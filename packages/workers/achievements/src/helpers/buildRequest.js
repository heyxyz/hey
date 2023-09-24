"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buildRequest = function (request, env, ctx) {
    var temp = request;
    temp.req = request;
    temp.env = env;
    temp.ctx = ctx;
    return temp;
};
exports.default = buildRequest;
