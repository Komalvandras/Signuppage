// src/pages/api/users.ts
import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;
if (!uri) throw new Error("Missing MONGODB_URI");
if (!dbName) throw new Error("Missing MONGODB_DB");

let clientPromise: Promise<MongoClient>;
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// POST — add new user (stores password as plain text)
export const POST: APIRoute = async ({ request }) => {
  try {
    const { firstName, lastName, email, password } = await request.json();
    if (!firstName || !lastName || !email || !password) {
      return json({ error: "Missing required fields" }, 400);
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const doc = {      
      first_name: String(firstName).trim(),
      last_name: String(lastName).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password), // ⚠ plain text
      created_at: new Date(),
    };

    const result = await users.insertOne(doc);
    return json({ ok: true, id: result.insertedId }, 201);
  } catch (e: any) {
    if (e?.code === 11000) return json({ error: "Email already exists" }, 409);
    return json({ error: e?.message ?? "Server error" }, 500);
  }
};

// GET — Login: email + password check
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const password = url.searchParams.get("password");

    if (!email || !password) {
      return json({ ok: false, error: "Missing email or password" }, 400);
    }
    console.log("Connecting to DB...");

    const client = await clientPromise;
    const db = client.db(dbName);
    const users = db.collection("users");
    console.log("Looking for user:", email);

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return json({ ok: false, error: "Invalid email or password" }, 401);
    }

    const isMatch = password === user.password; // ⚠️ Plaintext match (you can hash later)
    if (!isMatch) {
      return json({ ok: false, error: "Invalid email or password" }, 401);
    }

    return json({
      ok: true,
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
      },
    });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? "Server error" }, 500);
  }
};

