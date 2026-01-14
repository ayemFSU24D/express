import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI saknas i environment variables");
}

const client = new MongoClient(uri, {
  appName: "vercel-express-drugcentral",
  maxIdleTimeMS: 5000,
});

// Gör klienten säker för Vercel serverless
attachDatabasePool(client);

let drugDB;

export const connectDB = async () => {
  if (!drugDB) {
    await client.connect();
    drugDB = client.db(process.env.DB_NAME || "DrugCentral");
    console.log("✅ MongoDB connected");
  }
  return drugDB;
};

export { drugDB };
