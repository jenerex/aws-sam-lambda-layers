"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== "test") {
        console.log.apply(console, args);
    }
};
exports.log = log;
