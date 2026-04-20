import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "change-this-jwt-secret";
const isAdminAuthConfigured = () =>
  Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

const createToken = (adminId) =>
  jwt.sign({ id: adminId }, getJwtSecret(), {
    expiresIn: "7d"
  });

export const getAuthStatus = async (req, res) => {
  res.json({
    hasAdmin: isAdminAuthConfigured(),
    available: isAdminAuthConfigured()
  });
};

export const signupAdmin = async (req, res) => {
  res.status(503).json({
    error:
      "Admin signup is unavailable until ADMIN_EMAIL and ADMIN_PASSWORD are configured on the backend."
  });
};

export const loginAdmin = async (req, res) => {
  try {
    if (!isAdminAuthConfigured()) {
      return res.status(503).json({
        error:
          "Admin login is unavailable until ADMIN_EMAIL and ADMIN_PASSWORD are configured on the backend."
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (
      email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase() ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      token: createToken(process.env.ADMIN_EMAIL),
      admin: {
        id: process.env.ADMIN_EMAIL,
        name: "VK Group Admin",
        email: process.env.ADMIN_EMAIL
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminProfile = async (req, res) => {
  res.json({
    admin: req.admin
  });
};
