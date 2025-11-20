import express from "express";

import * as admin from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

//admin routes

router.post("/admins", authenticateToken, requireAdmin, admin.createAdmin);

router.get("/admins", authenticateToken, requireAdmin, admin.getAllAdmins);

router.get("/admins/:id", authenticateToken, requireAdmin, admin.getAdminById);

export default router;
