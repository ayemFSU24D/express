import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI saknas");

const client = new MongoClient(uri);
attachDatabasePool(client);

let drugDB;

export async function connectDB() {
  if (!drugDB) {
    await client.connect();
    drugDB = client.db(process.env.DB_NAME || "DrugCentral");
  }
  return drugDB;
}

export { drugDB };
