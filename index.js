import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection from "./database.js";
import productRoutes from "./Routers/product.js";
import authRoutes from "./Routers/auth.js";

dotenv.config();
///sassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
const app = express();
const port = 4000;

connection();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server side for your application is now running...");
});

app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server now listening on port ${port}`);
});