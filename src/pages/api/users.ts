// src/pages/api/users.ts
import type { APIRoute } from "astro";
import { getDb } from "../../lib/db";

type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const password = url.searchParams.get("password");

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "email and password required" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    const db = await getDb();
    // fetch only ONE document
    const user = await db.collection("users").findOne({
      email: String(email).toLowerCase().trim(),
      password, // plaintext per your request
    });

    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid credentials" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    // return a trimmed user object (don’t leak password)
    const { _id, email: userEmail, name, role } = user;
    return new Response(JSON.stringify({ ok: true, user: { _id, email: userEmail, name, role } }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("GET /api/users error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

/** Create user: POST /api/users { firstName, lastName, email } */
export const POST: APIRoute = async ({ request }) => {
    console.log("POST /api/users called");
    
  try {
    const body = (await request.json()) as Partial<NewUser>;
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!firstName || !lastName || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400 });
    }

    const db = await getDb();

    // enforce unique email
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 409 });
    }

    const result = await db.collection("users").insertOne({
      firstName,
      lastName,
      email,
      password, // plaintext for demo; hash in production!
      createdAt: new Date(),
    });

    console.log("✅ Inserted user:", result.insertedId.toString());

    return new Response(JSON.stringify({ id: result.insertedId }), {
      headers: { "content-type": "application/json" },
      status: 201,
    });
  } catch (e: any) {
    console.error("POST /api/users error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};