"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = exports.login = exports.signup = void 0;
var db_service_1 = require("../services/db.service");
var auth_service_1 = require("../services/auth.service");
var response_1 = require("../utils/response");
var logger_1 = require("../utils/logger");
var MONGO_URI = process.env.MONGO_URI;
var COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
var signup = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, email, password, users, existing, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                body = JSON.parse(event.body || "{}");
                email = body.email, password = body.password;
                if (!email || !password)
                    return [2 /*return*/, (0, response_1.failure)("email and password required", 400)];
                return [4 /*yield*/, (0, db_service_1.initDb)(MONGO_URI)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_service_1.getCollection)("users")];
            case 2:
                users = _a.sent();
                return [4 /*yield*/, users.findOne({ email: email })];
            case 3:
                existing = _a.sent();
                if (existing)
                    return [2 /*return*/, (0, response_1.failure)("User exists", 409)];
                return [4 /*yield*/, (0, auth_service_1.signUp)(COGNITO_CLIENT_ID, email, password)];
            case 4:
                _a.sent();
                return [4 /*yield*/, users.insertOne({ email: email, createdAt: new Date() })];
            case 5:
                _a.sent();
                return [2 /*return*/, (0, response_1.success)({ message: "User registered" }, 201)];
            case 6:
                err_1 = _a.sent();
                (0, logger_1.log)("signup error", err_1);
                return [2 /*return*/, (0, response_1.failure)(err_1.message || "Internal error", 500)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, email, password, auth, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = JSON.parse(event.body || "{}");
                email = body.email, password = body.password;
                if (!email || !password)
                    return [2 /*return*/, (0, response_1.failure)("email and password required", 400)];
                return [4 /*yield*/, (0, auth_service_1.signIn)(COGNITO_CLIENT_ID, email, password)];
            case 1:
                auth = _a.sent();
                return [2 /*return*/, (0, response_1.success)({ token: auth }, 200)];
            case 2:
                err_2 = _a.sent();
                (0, logger_1.log)("login error", err_2);
                return [2 /*return*/, (0, response_1.failure)(err_2.message || "Unauthorized", 401)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var home = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // API Gateway with Cognito authorizer will give user info; here we just return a friendly message
            return [2 /*return*/, (0, response_1.success)({ message: "Welcome to the home route", user: (event.requestContext.authorizer || {}) }, 200)];
        }
        catch (err) {
            (0, logger_1.log)("home error", err);
            return [2 /*return*/, (0, response_1.failure)(err.message || "Internal error", 500)];
        }
        return [2 /*return*/];
    });
}); };
exports.home = home;
