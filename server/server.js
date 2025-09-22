import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Connect cloudinary
await connectCloudinary();

// CORS: allow only your frontend
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"], // add your vercel frontend here
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

// Public route
app.get("/", (req, res) => {
  res.send("Hello from QuickAi server");
});

// API routes
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// Example of protecting a route (instead of applying globally)
app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({ message: "This is protected data!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
