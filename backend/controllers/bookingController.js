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

export async function getAllBookings(req, res) {
  try {
    let bookings;
    if (req.user.role == "admin") {
      bookings = await Booking.getAll();
    } else if (req.user.role == "customer") {
      bookings = await Booking.findByCustomerId(req.user.id);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.status(200).json(bookings);
  } catch {
    res.status(500).json({ message: error.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await Booking.getBookingDetails(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      req.user.role === "customer" &&
      booking.customer_id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied to this booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//admin updates
export async function updateBookingStatus(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update booking status" });
    }

    const { id } = req.params;
    const { booking_status } = req.body;

    const validStatuses = ["pending", "confirmed", "canceled", "completed"];
    if (!booking_status || !validStatuses.includes(booking_status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const result = await Booking.update(id, { booking_status });
    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//customer updates
export async function updateBookingByCustomer(req, res) {
  try {
    if (req.user.role !== "customer") {
      return req
        .status(403)
        .json({ message: "Only customers can update their bookings" });
    }
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ["location", "payment_method", "booking_status"];

    Object.keys(updates).forEach((key) => {
      if (!allowedFields.includes(key)) delete updates[key];
    });

    if (updates.booking_status && updates.booking_status !== "canceled") {
      return res
        .status(403)
        .json({ message: "Customers can only cancel bookings" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.customer_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied to this booking" });
    }

    const result = await Booking.update(id, updates);
    res.status(200).json({ message: "Booking updated successfully" });
  } catch {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins may delete bookings" });
    }

    const { id } = req.params;
    const result = await Booking.delete(id);

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
