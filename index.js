import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection from "./database.js";
import productRoutes from "./Routers/product.js";
import authRoutes from "./Routers/auth.js";
import jobRoutes from "./Routers/job.js";
import ocrRoutes from "./Routers/ocr.js";
import accessibilityRouter from "./Routers/accessibility.js";
import applicationRoutes from "./Routers/application.js";
import session from "express-session";
import passport from "./passport.js";

dotenv.config();

console.log("OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);

const app = express();
const port = process.env.PORT || 4000;

// Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
connection();

// CORS
app.use(
  cors({
    origin: [
  "http://localhost:8080",
  "https://inclusive-hire.netlify.app",
],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Static Files
app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.send("Server side for your application is now running...");
});

// Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/ocr", ocrRoutes);
app.use("/accessibility", accessibilityRouter);
app.use("/applications", applicationRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server now listening on port ${port}`);
});