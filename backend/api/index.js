import dotenv from "dotenv";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

let isReady = false;

export default async function handler(req, res) {
  if (!isReady) {
    await connectDB();
    isReady = true;
  }

  return app(req, res);
}
