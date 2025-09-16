import { MongoClient, Db, Collection } from "mongodb";
import { log } from "../utils/logger";

let client: MongoClient | undefined;
let db: Db | undefined;

export async function initDb(mongoUri: string) {
  if (client && db) return db;
  log("Connecting to mongo url:", mongoUri);
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db("mydb");
  log("Connected to MongoDB/DocumentDB");
  return db;
}

export async function getCollection(name: string): Promise<Collection<any>> {
  if (!db) throw new Error("DB not initialized");
  return db.collection(name);
}
