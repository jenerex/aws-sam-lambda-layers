import { APIGatewayProxyHandler } from "aws-lambda";
import { initDb, getCollection } from "../services/db.service";
import { signUp, signIn } from "../services/auth.service";
import { success, failure } from "../utils/response";
import { log } from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID; 

/**
 * Signup handler
 */
export const signup: APIGatewayProxyHandler = async (event) => {
  try {
    if (!MONGO_URI || !COGNITO_CLIENT_ID) {
      return failure("Missing environment configuration", 500);
    }

    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    if (!email || !password) {
      return failure("email and password required", 400);
    }

    await initDb(MONGO_URI);
    const users = await getCollection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return failure("User already exists", 409);
    }

    await signUp(COGNITO_CLIENT_ID, email, password);
    await users.insertOne({ email, createdAt: new Date() });

    return success({ message: "User registered" }, 201);
  } catch (err: any) {
    log("signup error", err);
    return failure(err.message || "Internal server error", 500);
  }
};

/**
 * Login handler
 */
export const login: APIGatewayProxyHandler = async (event) => {
  try {
    if (!COGNITO_CLIENT_ID) {
      return failure("Missing environment configuration", 500);
    }

    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    if (!email || !password) {
      return failure("email and password required", 400);
    }

    const token = await signIn(COGNITO_CLIENT_ID, email, password);
    return success({ token }, 200);
  } catch (err: any) {
    log("login error", err);
    return failure(err.message || "Unauthorized", 401);
  }
};

/**
 * Home handler
 */
export const home: APIGatewayProxyHandler = async (event) => {
  try {
    const user = event.requestContext?.authorizer || {};
    return success(
      { message: "Welcome to the home route", user },
      200
    );
  } catch (err: any) {
    log("home error", err);
    return failure(err.message || "Internal server error", 500);
  }
};
