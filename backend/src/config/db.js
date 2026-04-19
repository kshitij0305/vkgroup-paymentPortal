import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  cachedConnection = await mongoose.connect(process.env.MONGO_URI);
  return cachedConnection;
};

export default connectDB;
