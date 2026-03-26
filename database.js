import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to the database");
    console.error(error.message);
    process.exit(1);
  }
};

export default connection;