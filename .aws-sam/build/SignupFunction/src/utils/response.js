"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
var success = function (body, statusCode) {
    if (statusCode === void 0) { statusCode = 200; }
    return ({
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
};
exports.success = success;
var failure = function (message, statusCode) {
    if (statusCode === void 0) { statusCode = 400; }
    return ({
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: message })
    });
};
exports.failure = failure;
