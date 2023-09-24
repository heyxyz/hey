"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tracking_1 = require("@hey/data/tracking");
var filteredEvents = [
    tracking_1.PROFILE.FOLLOW,
    tracking_1.PROFILE.SUPER_FOLLOW,
    tracking_1.PUBLICATION.LIKE,
    tracking_1.PUBLICATION.NEW_POST,
    tracking_1.PUBLICATION.NEW_COMMENT,
    tracking_1.PUBLICATION.MIRROR,
    tracking_1.PUBLICATION.COLLECT_MODULE.COLLECT,
    tracking_1.PUBLICATION.WIDGET.SNAPSHOT.VOTE
];
exports.default = filteredEvents;
