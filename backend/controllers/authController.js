import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";
import { Admin } from "../models/admin.js";
import * as validators from "../utils/validators.js";

export async function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

export async function register(req, res) {
  try {
    const {
      /*username,*/ email,
      password,
      first_name,
      last_name,
      phone /*address*/,
    } = req.body;

    if (
      //!username ||
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !phone
      //!address
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const errors = [];

    // if (!validators.isValidUsername(username))
    //   errors.push("Username must be 3–20 letters/numbers");

    if (!validators.isValidEmail(email)) errors.push("Invalid email format");

    if (!validators.isValidPassword(password))
      errors.push(
        "Password must be at least 8 chars, include uppercase, lowercase, number"
      );

    if (!validators.isValidPhone(phone)) errors.push("Invalid phone number");

    if (errors.length > 0) return res.status(400).json({ message: errors });

    const existing = await Customer.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: "email already exists" });

    await Customer.create({
      //username,
      email,
      password,
      first_name,
      last_name,
      phone,
      //address,
    });

    res.status(201).json({ message: "Customer created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findByEmail(email);

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { accessToken, refreshToken } = await generateTokens({
        _id: admin._id,
        role: "admin",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Admin login successful",
        accessToken,
        role: "admin",
      });
    }

    const customer = await Customer.findByEmail(email);
    if (customer && (await bcrypt.compare(password, customer.password))) {
      const { accessToken, refreshToken } = await generateTokens({
        _id: customer._id,
        role: "customer",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Customer login successful",
        accessToken,
        role: "customer",
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { id, role } = req.user;

    const Model = role === "admin" ? Admin : Customer;
    const user = await Model.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res.status(401).json({ message: "Missing refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const newAccess = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccess });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id, role } = req.user;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0)
      return res.status(400).json({ message: "No update data provided" });

    delete updates.role;
    delete updates._id;
    delete updates.created_at;

    const errors = [];

    // if (updates.username && !validators.isValidUsername(updates.username))
    //   errors.push("Invalid username");

    if (updates.email && !validators.isValidEmail(updates.email))
      errors.push("Invalid email");

    if (updates.password && !validators.isValidPassword(updates.password))
      errors.push("Invalid password format");

    if (errors.length > 0) return res.status(400).json({ message: errors });

    if (updates.password)
      updates.password = await bcrypt.hash(updates.password, 10);

    const Model = role === "admin" ? Admin : Customer;

    const result = await Model.update(id, updates);

    if (result.modifiedCount === 0)
      return res.status(400).json({ message: "No changes made" });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProfile(req, res) {
  try {
    const { id, role } = req.user;

    const Model = role === "admin" ? Admin : Customer;

    const result = await Model.delete(id);

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
