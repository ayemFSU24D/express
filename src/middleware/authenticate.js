import admin from "firebase-admin";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Missing authorization header",
        message: "Required: Authorization: Bearer <firebase_id_token>"
      });
    }

    // Extract Bearer token
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ 
        error: "Invalid auth header format",
        message: "Expected: Bearer <token>"
      });
    }

    const token = parts[1];

    // Verify Firebase ID token
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded;
      console.log(`✅ Auth verified for user: ${decoded.uid}`);
      next();
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError.code);
      
      if (tokenError.code === "auth/id-token-expired") {
        return res.status(401).json({ error: "Token expired" });
      }
      if (tokenError.code === "auth/id-token-revoked") {
        return res.status(401).json({ error: "Token revoked" });
      }
      
      return res.status(401).json({ 
        error: "Invalid token",
        message: tokenError.message
      });
    }
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(500).json({ error: "Authentication failed" });
  }
};
