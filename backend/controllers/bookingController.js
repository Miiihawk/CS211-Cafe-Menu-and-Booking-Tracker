import { Booking } from "../models/Booking.js";
import { getCollection } from "../config/database.js";
import { Package } from "../models/Package.js";
import { ObjectId } from "mongodb";

const toObjectId = (id) => new ObjectId(id);

export async function createBooking(req, res) {
  try {
    const { customer_id, payment_method, event_address, package_id } = req.body;

    if (req.user.role === "admin") {
      if (!customer_id) {
        return res.status(400).json({
          message: "customer account is required for booking",
        });
      }
    } else {
      return res.status(403).json({ message: "unauthorize role" });
    }

    const finalCustomerId =
      req.user.role === "customer" ? req.user.id : customer_id;

    if (!package_id) {
      return res.status(400).json({ message: "Booking mush include package" });
    }

    if (!payment_method || !event_address || !package_id) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const packageData = await Package.findById(package_id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    const total_amount = packageData.package_price;

    const booking = await Booking.create({
      customer_id: finalCustomerId,
      package_id: packageData._id,
      total_amount,
      payment_method,
      booking_date: req.body.booking_date,
      event_location: event_address,
    });

    res.status(201).json({ message: "Booking created successfully" });
  } catch {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllBookings(req, res) {}
