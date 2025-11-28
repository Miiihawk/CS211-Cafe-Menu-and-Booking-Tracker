import express from "express";

import * as auth from "../controllers/authController.js";

import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

//user registration route
router.post("/register", auth.register);

//user login route
router.post("/login", auth.login);

router.post("/refresh", auth.refreshToken);

//get user profile route (protected)
router.get("/users/me", authenticateToken, auth.getUserProfile);

//update user profile route (protected)
router.patch("/users/me", authenticateToken, auth.updateProfile);

//delete user account route (protected)
router.delete("/users/me", authenticateToken, auth.deleteProfile);

// logout route (protected)
router.post("/logout", auth.logout);

export default router;
