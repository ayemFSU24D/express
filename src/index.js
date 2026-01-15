import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/DB.js";
import drugRoutes from "./routes/drugRoutes.js";
import { authenticate } from "./middleware/authenticate.js";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin - works on Vercel with env var
let firebaseInitialized = false;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log("✅ Firebase initialized from env var");
  } else {
    console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT not set - auth will not work");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error.message);
}

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) =>  {
  res.send("Backend running on Vercel ✅");
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: "healthy",
    firebase: firebaseInitialized ? "ready" : "not configured",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

// Public drug routes
app.use("/drug", drugRoutes);

// Protected drug routes - requires Firebase auth token
app.use("/auth/drug", authenticate, drugRoutes);

export default app
