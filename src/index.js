import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/DB.js";
import drugRoutes from "./routes/drugRoutes.js";
//import { authenticate } from "./middleware/authenticate.js";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
 fs.readFileSync(process.env.SERVICE_ACCOUNT_FILE, "utf8")
);

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();


app.get("/", (req, res) =>  {
  res.send("Backend running on Vercel ✅");
});

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.use("/drug", drugRoutes);
app.use("/auth/drug", drugRoutes);
//app.use("/free/drug", drugRoutes);

export default app
