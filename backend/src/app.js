import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const configuredOrigins = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions =
  configuredOrigins.length > 0
    ? {
        origin(origin, callback) {
          if (!origin || configuredOrigins.includes(origin)) {
            callback(null, true);
            return;
          }

          callback(new Error("Origin not allowed by CORS"));
        }
      }
    : undefined;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    origins: configuredOrigins.length > 0 ? configuredOrigins : ["*"]
  });
});

export default app;
