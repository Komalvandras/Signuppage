// src/lib/db.ts
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();


const g = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is missing in .env");
}

let clientPromise: Promise<MongoClient>;
if (!g._mongoClientPromise) {
  const client = new MongoClient(uri);
  g._mongoClientPromise = client.connect();
}
clientPromise = g._mongoClientPromise;

/** Return a ready-to-use Db instance. Change default DB with MONGODB_DB */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB; 
  return client.db(dbName);
}

/** Optional: call this only in tests/shutdown scripts */
export async function disconnect(): Promise<void> {
  const client = await clientPromise;
  await client.close();
  g._mongoClientPromise = undefined;
}
