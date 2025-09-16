"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = exports.login = exports.signup = void 0;
const db_service_1 = require("../services/db.service");
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const MONGO_URI = process.env.MONGO_URI;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
/**
 * Signup handler
 */
const signup = async (event) => {
    try {
        if (!MONGO_URI || !COGNITO_CLIENT_ID) {
            return (0, response_1.failure)("Missing environment configuration", 500);
        }
        const body = JSON.parse(event.body || "{}");
        const { email, password } = body;
        if (!email || !password) {
            return (0, response_1.failure)("email and password required", 400);
        }
        await (0, db_service_1.initDb)(MONGO_URI);
        const users = await (0, db_service_1.getCollection)("users");
        const existing = await users.findOne({ email });
        if (existing) {
            return (0, response_1.failure)("User already exists", 409);
        }
        await (0, auth_service_1.signUp)(COGNITO_CLIENT_ID, email, password);
        await users.insertOne({ email, createdAt: new Date() });
        return (0, response_1.success)({ message: "User registered" }, 201);
    }
    catch (err) {
        (0, logger_1.log)("signup error", err);
        return (0, response_1.failure)(err.message || "Internal server error", 500);
    }
};
exports.signup = signup;
/**
 * Login handler
 */
const login = async (event) => {
    try {
        if (!COGNITO_CLIENT_ID) {
            return (0, response_1.failure)("Missing environment configuration", 500);
        }
        const body = JSON.parse(event.body || "{}");
        const { email, password } = body;
        if (!email || !password) {
            return (0, response_1.failure)("email and password required", 400);
        }
        const token = await (0, auth_service_1.signIn)(COGNITO_CLIENT_ID, email, password);
        return (0, response_1.success)({ token }, 200);
    }
    catch (err) {
        (0, logger_1.log)("login error", err);
        return (0, response_1.failure)(err.message || "Unauthorized", 401);
    }
};
exports.login = login;
/**
 * Home handler
 */
const home = async (event) => {
    var _a;
    try {
        const user = ((_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.authorizer) || {};
        return (0, response_1.success)({ message: "Welcome to the home route", user }, 200);
    }
    catch (err) {
        (0, logger_1.log)("home error", err);
        return (0, response_1.failure)(err.message || "Internal server error", 500);
    }
};
exports.home = home;
