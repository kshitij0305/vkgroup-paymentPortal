import mongoose from "mongoose";

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 && cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false
      })
      .then((connection) => {
        cachedConnection = connection;
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  cachedConnection = await connectionPromise;
  return cachedConnection;
};

export default connectDB;
