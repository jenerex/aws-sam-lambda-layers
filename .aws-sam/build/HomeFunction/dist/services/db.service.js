"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
exports.getCollection = getCollection;
const mongodb_1 = require("mongodb");
const logger_1 = require("../utils/logger");
let client;
let db;
async function initDb(mongoUri) {
    if (client && db)
        return db;
    client = new mongodb_1.MongoClient(mongoUri);
    await client.connect();
    db = client.db("mydb");
    (0, logger_1.log)("Connected to MongoDB/DocumentDB");
    return db;
}
async function getCollection(name) {
    if (!db)
        throw new Error("DB not initialized");
    return db.collection(name);
}
