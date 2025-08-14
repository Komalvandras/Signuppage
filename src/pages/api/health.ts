import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

// Read from your .env
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;
if (!uri) throw new Error("Missing MONGODB_URI");
if (!dbName) throw new Error("Missing MONGODB_DB");

// Reuse a single Mongo client (good for dev HMR)
let clientPromise: Promise<MongoClient>;
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise_health: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise_health) {
  const client = new MongoClient(uri);
  global._mongoClientPromise_health = client.connect();
}
clientPromise = global._mongoClientPromise_health;

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    // Ping the DB
    await db.command({ ping: 1 });

    // Optional: quick server time/readiness info
    const serverStatus = await db.admin().serverStatus().catch(() => null);

    return json({
      ok: true,
      db: dbName,
      serverTime: new Date().toISOString(),
      mongoOk: true,
      version: serverStatus?.version ?? undefined,
    });
  } catch (e: any) {
    return json(
      {
        ok: false,
        mongoOk: false,
        error: e?.message ?? "Unknown Mongo error",
        hint:
          "Check Database Access user/password, IP allowlist, and URL-encode special characters in your password.",
      },
      500
    );
  }
};
