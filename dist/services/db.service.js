"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
exports.getCollection = getCollection;

const { MongoClient } = require("mongodb");
const path = require("path");
const { log } = require("../utils/logger");

let client;
let db;

async function initDb(mongoUri) {
    if (client && db) return db;

    const isLocal = process.env.AWS_SAM_LOCAL === "true"; // SAM sets this when running locally
    const options = {};

    if (!isLocal) {
        // In AWS Lambda → enable TLS with DocumentDB global-bundle.pem
        const pemPath = path.join(__dirname, "global-bundle.pem");
        options.tls = true;
        options.tlsCAFile = pemPath;
    }

    client = new MongoClient(mongoUri, options);
    await client.connect();
    db = client.db("mydb"); // adjust DB name if needed

    log(`Connected to MongoDB/DocumentDB (${isLocal ? "local" : "cloud"})`);
    return db;
}

async function getCollection(name) {
    if (!db) throw new Error("DB not initialized");
    return db.collection(name);
}
