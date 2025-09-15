"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = exports.login = exports.signup = void 0;
const db_service_1 = require("../services/db.service");
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const MONGO_URI = process.env.MONGO_URI;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const signup = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { email, password } = body;
         console.log("MONGO_URI:", process.env.MONGO_URI);
          console.log("all env:", process.env);
        if (!email || !password)
            return (0, response_1.failure)("email and password required", 400);
        await (0, db_service_1.initDb)(MONGO_URI);
        console.log('db initialized');
        const users = await (0, db_service_1.getCollection)("users");
        const existing = await users.findOne({ email }); 
        if (existing)
            return (0, response_1.failure)("User exists", 409);
        await (0, auth_service_1.signUp)(COGNITO_CLIENT_ID, email, password);
        await users.insertOne({ email, createdAt: new Date() });
        return (0, response_1.success)({ message: "User registered" }, 201);
    }
    catch (err) {
        (0, logger_1.log)("signup error", err);
        return (0, response_1.failure)(err.message || "Internal error", 500);
    }
};
exports.signup = signup;
const login = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { email, password } = body;
        if (!email || !password)
            return (0, response_1.failure)("email and password required", 400);
        const auth = await (0, auth_service_1.signIn)(COGNITO_CLIENT_ID, email, password);
        return (0, response_1.success)({ token: auth }, 200);
    }
    catch (err) {
        (0, logger_1.log)("login error", err);
        return (0, response_1.failure)(err.message || "Unauthorized", 401);
    }
};
exports.login = login;
const home = async (event) => {
    try {
        // API Gateway with Cognito authorizer will give user info; here we just return a friendly message
        return (0, response_1.success)({ message: "Welcome to the home route", user: (event.requestContext.authorizer || {}) }, 200);
    }
    catch (err) {
        (0, logger_1.log)("home error", err);
        return (0, response_1.failure)(err.message || "Internal error", 500);
    }
};
exports.home = home;
