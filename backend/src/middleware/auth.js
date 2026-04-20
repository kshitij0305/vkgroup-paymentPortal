import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "change-this-jwt-secret";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const configuredEmail = process.env.ADMIN_EMAIL;

    if (!configuredEmail || !process.env.ADMIN_PASSWORD) {
      return res.status(503).json({
        error:
          "Admin access is unavailable until ADMIN_EMAIL and ADMIN_PASSWORD are configured on the backend."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded.id !== configuredEmail) {
      return res.status(401).json({ error: "Admin account not found" });
    }

    req.admin = {
      id: configuredEmail,
      name: "VK Group Admin",
      email: configuredEmail
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
