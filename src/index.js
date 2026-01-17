import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/DB.js";
import drugRoutes from "./routes/drugRoutes.js";
import { authenticate } from "./middleware/authenticate.js";
//import "./config/firebase.js"; // 🔥 ENDAST import

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Backend running on Vercel ✅");
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    firebase: "initialized",
    timestamp: new Date().toISOString(),
  });
});

// Public
app.use("/drug", drugRoutes);

// Protected
app.use("/auth/drug", authenticate, drugRoutes);
//app.use("/free/drug", drugRoutes);

export default app;