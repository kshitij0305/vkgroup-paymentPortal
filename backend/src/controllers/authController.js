import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const getJwtSecret = () => process.env.JWT_SECRET || "change-this-jwt-secret";

const createToken = (adminId) =>
  jwt.sign({ id: adminId }, getJwtSecret(), {
    expiresIn: "7d"
  });

export const getAuthStatus = async (req, res) => {
  const adminCount = await Admin.countDocuments();

  res.json({
    hasAdmin: adminCount > 0
  });
};

export const signupAdmin = async (req, res) => {
  try {
    const existingAdminCount = await Admin.countDocuments();

    if (existingAdminCount > 0) {
      return res.status(403).json({
        error: "Master admin already exists. Please log in."
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      token: createToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      token: createToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
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
