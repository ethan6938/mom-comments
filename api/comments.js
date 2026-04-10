import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "birthday_app";

let clientPromise;

function getClientPromise() {
  if (!uri) return null;

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export default async function handler(req, res) {
  try {
    if (!uri) {
      return res.status(500).json({
        error: "Missing MONGODB_URI environment variable in Vercel"
      });
    }

    const promise = getClientPromise();
    const client = await promise;
    const db = client.db(dbName);
    const comments = db.collection("comments");

    if (req.method === "GET") {
      const allComments = await comments
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(allComments);
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

      const name = String(body.name || "").trim();
      const message = String(body.message || "").trim();

      if (!name || !message) {
        return res.status(400).json({
          error: "Name and message are required"
        });
      }

      await comments.insertOne({
        name,
        message,
        createdAt: new Date()
      });

      return res.status(201).json({ success: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}