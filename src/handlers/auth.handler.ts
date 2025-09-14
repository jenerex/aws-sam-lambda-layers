import { APIGatewayProxyHandler } from "aws-lambda";
import { initDb, getCollection } from "../services/db.service";
import { signUp, signIn, signOut } from "../services/auth.service";
import { success, failure } from "../utils/response";
import { log } from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI!;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

export const signup: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;
    if (!email || !password) return failure("email and password required", 400);

    await initDb(MONGO_URI);
    const users = await getCollection("users");
    const existing = await users.findOne({ email });
    if (existing) return failure("User exists", 409);

    await signUp(COGNITO_CLIENT_ID, email, password);
    await users.insertOne({ email, createdAt: new Date() });

    return success({ message: "User registered" }, 201);
  } catch (err: any) {
    log("signup error", err);
    return failure(err.message || "Internal error", 500);
  }
};

export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;
    if (!email || !password) return failure("email and password required", 400);

    const auth = await signIn(COGNITO_CLIENT_ID, email, password);
    return success({ token: auth }, 200);
  } catch (err: any) {
    log("login error", err);
    return failure(err.message || "Unauthorized", 401);
  }
};

export const home: APIGatewayProxyHandler = async (event) => {
  try {
    // API Gateway with Cognito authorizer will give user info; here we just return a friendly message
    return success({ message: "Welcome to the home route", user: (event.requestContext.authorizer || {}) }, 200);
  } catch (err: any) {
    log("home error", err);
    return failure(err.message || "Internal error", 500);
  }
};
