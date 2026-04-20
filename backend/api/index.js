import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  return app(req, res);
}
