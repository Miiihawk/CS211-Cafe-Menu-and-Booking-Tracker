import { Booking } from "../models/Booking.js";
import { getCollection } from "../config/database.js";
import { Package } from "../models/Package.js";
import { ObjectId } from "mongodb";

const toObjectId = (id) => new ObjectId(id);

export async function createBooking(req, res) {
  try {
    const {
      first_name,
      last_name,
      phone,
      payment_method,
      event_address,
      package_id,
      booking_date,
      quantity,
      booking_status,
    } = req.body;

    if (req.user.role !== "customer") {
      return res.status(400).json({
        message: "customer account is required for booking",
      });
    }

    if (!payment_method || !event_address || !package_id) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const packageData = await Package.findById(package_id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    const total_amount = packageData.Package_price * (quantity || 1);

    const booking = await Booking.create({
      customer_id: req.user.id,
      first_name,
      last_name,
      phone,
      package_id: packageData._id,
      total_amount,
      quantity: quantity || 1,
      payment_method,
      booking_date,
      event_address,
      booking_status: booking_status || "pending",
    });

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
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

    // Populate package_name for each booking
    const bookingsWithPackage = await Promise.all(
      bookings.map(async (b) => {
        const pkg = await Package.findById(b.package_id);
        return {
          ...b,
          package_name: pkg ? pkg.Package_name : "Package",
        };
      })
    );

    res.status(200).json(bookingsWithPackage);
  } catch (error) {
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

    // Populate package_name
    const pkg = await Package.findById(booking.package_id);
    const bookingWithPackage = {
      ...booking,
      package_name: pkg ? pkg.Package_name : "Package",
    };

    res.status(200).json(bookingWithPackage);
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
      return res
        .status(403)
        .json({ message: "Only customers can update their bookings" });
    }
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ["event_address", "payment_method", "booking_status"];

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
  } catch (error) {
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
