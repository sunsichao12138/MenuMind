import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authMiddleware } from "./middleware/auth";
import authRouter from "./routes/auth";
import ingredientsRouter from "./routes/ingredients";
import recipesRouter from "./routes/recipes";
import favoritesRouter from "./routes/favorites";
import plansRouter from "./routes/plans";
import historyRouter from "./routes/history";
import profileRouter from "./routes/profile";
import aiRouter from "./routes/ai";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Public routes (no auth required)
app.use("/api/auth", authRouter);

// Protected routes (auth required)
app.use("/api/ingredients", authMiddleware, ingredientsRouter);
app.use("/api/recipes", authMiddleware, recipesRouter);
app.use("/api/favorites", authMiddleware, favoritesRouter);
app.use("/api/plans", authMiddleware, plansRouter);
app.use("/api/history", authMiddleware, historyRouter);
app.use("/api/profile", authMiddleware, profileRouter);
app.use("/api/ai", authMiddleware, aiRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
