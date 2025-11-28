import express from "express";
import * as packageController from "../controllers/packageController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", packageController.getAllPackages);
router.get("/:id", packageController.getPackageById);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  packageController.createPackage
);

router.patch(
  "/",
  authenticateToken,
  requireAdmin,
  packageController.updatePackage
);

router.delete(
  "/",
  authenticateToken,
  requireAdmin,
  packageController.deletePackage
);

export default router;
