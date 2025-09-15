"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.signIn = signIn;
exports.signOut = signOut;
const AWS = __importStar(require("aws-sdk"));
const cognito = new AWS.CognitoIdentityServiceProvider();
function isOffline() {
    return process.env.IS_OFFLINE === "true" || process.env.NODE_ENV === "development";
}
async function signUp(userPoolClientId, email, password) {
    if (isOffline()) {
        // Mocked signup response
        console.log("[MOCK] SignUp called locally");
        return { email, message: "Signed up (mock)" };
    }
    await cognito
        .signUp({
        ClientId: userPoolClientId,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
    })
        .promise();
    return { email };
}
async function signIn(userPoolClientId, email, password) {
    if (isOffline()) {
        console.log("[MOCK] SignIn called locally");
        return {
            AccessToken: "dummy-access-token",
            IdToken: "dummy-id-token",
            RefreshToken: "dummy-refresh-token",
        };
    }
    const resp = await cognito
        .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: userPoolClientId,
        AuthParameters: { USERNAME: email, PASSWORD: password },
    })
        .promise();
    return resp.AuthenticationResult;
}
async function signOut(accessToken) {
    if (isOffline()) {
        console.log("[MOCK] SignOut called locally");
        return true;
    }
    await cognito.globalSignOut({ AccessToken: accessToken }).promise();
    return true;
}
