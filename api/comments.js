import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "birthday_app";

let client;
let clientPromise;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
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
      const { name, message } = req.body || {};

      if (!name || !message) {
        return res.status(400).json({
          error: "Name and message are required"
        });
      }

      await comments.insertOne({
        name: String(name).trim(),
        message: String(message).trim(),
        createdAt: new Date()
      });

      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
