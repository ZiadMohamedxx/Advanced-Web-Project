import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection from "./database.js";
import productRoutes from "./Routers/product.js";
import authRoutes from "./Routers/auth.js";
import jobRoutes from "./Routers/job.js"; 
import session from "express-session";
import passport from "./passport.js";

dotenv.config();

const app = express();
const port = 4000;
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
connection();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server side for your application is now running...");
});

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes); // ✅ add this

app.listen(port, () => {
  console.log(`Server now listening on port ${port}`);
});