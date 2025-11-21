import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";
import { Admin } from "../models/admin.js";
import * as validators from "../utils/validators.js";

function generateToken(user) {
  const acessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "20m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { acessToken, refreshToken };
}

export async function register(req, res) {
  try {
    const {
      /*username,*/ email,
      password,
      first_name,
      last_name,
      phone,
      //address,
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

    /*if (!validators.isValidUsername(username))
      errors.push(
        "Invalid username. Must be 3-20 characters long and can contain letters and numbers"
      );*/

    if (!validators.isValidEmail(email))
      errors.push("Invalid email format. Must be a valid ciit email address");

    if (!validators.isValidPassword(password))
      errors.push(
        "Invalid password. Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );

    if (!validators.isValidPhone(phone)) errors.push("Invalid phone number");

    if (errors.length > 0) return res.status(400).json({ message: errors });

    await Customer.create({
      /*username,*/
      email,
      password,
      first_name,
      last_name,
      phone,
      //address,
    });

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await Admin.findByEmail({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { acessToken, refreshToken } = generateToken(admin)({
        id: admin._id,
        role: "admin",
      });

      res.cookie("access_token", acessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 60 * 1000, // 20 minutes
      });

      return res.status(200).json({
        message: "Admin logged in successfully",
        accessToken,
        role: "admin",
      });
    }

    const customer = await Customer.findByEmail(email);

    if (!customer && (await bcrypt.compare(password, customer.password))) {
      const { acessToken, refreshToken } = generateToken(customer)({
        id: customer._id,
        role: "customer",
      });

      res.cookie("access_token", acessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 60 * 1000, // 20 minutes
      });

      return res.status(200).json({
        message: "Customer logged in successfully",
        accessToken,
        role: "customer",
      });
    }

    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { id, role } = req.user;

    const Model = role === "admin" ? Admin : Customer;
    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = user;

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid/Expired refresh token" });
      }

      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          role: decoded.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export async function updateProfile(req, res) {
  try {
    const { id, role } = req.user;
    const updates = req.body;

    if (!updates || Object.keys(updates) === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    delete updates.role;
    delete updates._id;
    delete updates.createdAt;

    const errors = [];
    if (updates.email && !validators.isValidEmail(updates.email))
      errors.push("Invalid email format. Must be a valid ciit email address");
    if (updates.password && !validators.isValidPassword(updates.password))
      errors.push(
        "Invalid password. Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const model = (role = await Model.update(id, updates));

    if (XPathResult.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes made" });
    }

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

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
