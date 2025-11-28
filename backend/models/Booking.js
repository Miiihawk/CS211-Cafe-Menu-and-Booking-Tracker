import { getCollection } from "../config/database.js";
import { ObjectId } from "mongodb";

export class Booking {
  static getCollection() {
    return getCollection("bookings");
  }

  static bookingStatus = ["pending", "confirmed", "canceled", "completed"];
  // static paymentStatus = ["pending", "paid", "refunded"];

  static toObjectId(id) {
    return typeof id === "string" ? new ObjectId(id) : id;
  }

  static validate(data) {
    const errors = [];

    if (!data.customer_id) {
      errors.push("Customer ID is required");
    }
    if (
      !data.booking_status ||
      !this.bookingStatus.includes(data.booking_status)
    ) {
      errors.push("Invalid booking status");
    }

    // if (
    //   !data.payment_status ||
    //   !this.paymentStatus.includes(data.paymentStatus)
    // ) {
    //   errors.push("Invalid payment status");
    // }

    if (
      !data.total_amount ||
      typeof data.total_amount !== "number" ||
      data.total_amount < 0
    ) {
      errors.push("Total amount must be a positive number");
    }

    if (!data.payment_method) {
      errors.push("Payment method is required");
    }

    if (!data.booking_date) {
      errors.push("Booking date is required");
    } else if (isNaN(Date.parse(data.booking_date))) {
      errors.push("Booking date must be a valid date");
    }

    //basically this is address of event
    if (!data.event_address) {
      errors.push("Location address is required");
    }

    return errors;
  }

  static async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const booking = {
      ...data,
      customer_id: this.toObjectId(data.customer_id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.getCollection().insertOne(booking);
    return { ...booking, _id: result.insertedId };
  }

  static async findById(id) {
    return this.getCollection().findOne({ _id: this.toObjectId(id) });
  }

  static async update(id, updates) {
    if (
      updates.bookingstatus &&
      !this.bookingstatus.includes(updates.booking_status)
    ) {
      throw new Error("Invalid booking status");
    }

    if (
      updates.paymentStatus &&
      !this.paymentStatus.includes(updates.payment_status)
    ) {
      throw new Error("Invalid payment status");
    }
    updates.updatedAt = new Date();
    return await this.getCollection().updateOne(
      { _id: this.toObjectId(id) },
      { $set: updates }
    );
  }

  static async delete(id) {
    const ObjectId = this.toObjectId(id);
    await getCollection("bookings_details").deleteOne({ booking_id: ObjectId });

    return await this.getCollection().deleteOne({ _id: ObjectId });
  }

  static async getAll() {
    return await this.getCollection().find().toArray();
  }

  static async findByCustomerId(customer_id) {
    return await this.getCollection()
      .find({ customer_id: this.toObjectId(customer_id) })
      .toArray();
  }

  static async getBookingDetails(id) {
    const booking = await this.findById(id);
    if (!booking) return null;

    const bookingDetails = await getCollection("booking_details")
      .find({ booking_id: booking._id })
      .toArray();

    return { ...booking, booking_details: bookingDetails };
  }
}

export default Booking;
