import { Admin } from "../models/admin.js";
import { Customer } from "../models/customer.js";
import * as validators from "../utils/validators.js";

export async function seedAdmin(req, res) {
  const existingAdmin = await Admin.findByEmail(process.env.ADMIN_EMAIL);
  if (!existingAdmin) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      is_active: true,
      last_login: null,
    });
    console.log("First Admin user created successfully");
  }
}

export async function createAdmin(req, res) {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!validators.isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validators.isValidPassword(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    const existingAdmin = await Admin.findByEmail(email);

    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" });
    }

    await Admin.create({
      email,
      password,
      full_name,
      role: "admin",
      is_active: true,
      last_login: null,
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllAdmins(req, res) {
  try {
    const admins = await Admin.getAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function getAdminById(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { password, ...adminData } = admin; // Exclude password
    res.status(200).json(adminData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
