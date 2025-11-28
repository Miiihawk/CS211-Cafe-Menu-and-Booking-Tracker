import express, { Router } from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, bookingController.getAllBookings);
router.get("/:id", authenticateToken, bookingController.getBookingById);

router.post("/", authenticateToken, bookingController.createBooking);
router.patch("/", authenticateToken, bookingController.updateBookingByCustomer);

router.patch(
  "/:id/:status",
  authenticateToken,
  requireAdmin,
  bookingController.updateBookingStatus
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  bookingController.deleteBooking
);

export default router;
