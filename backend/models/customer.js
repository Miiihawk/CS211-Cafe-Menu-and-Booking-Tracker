import { getCollection } from "../config/database.js";
import bcrypt from "bcrypt";

//customer model

export class Customer {
  static getCollection() {
    return getCollection("customers");
  }

  static async findByEmail(email) {
    return await this.getCollection().findOne({ email });
  }

  static async findById(id) {
    const { ObjectId } = await import("mongodb");
    return this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  //create a new customer

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const customer = {
      ...data,
      password: hashedPassword,
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.getCollection().insertOne(customer);
  }

  //update customer by id
  static async update(id, updates) {
    const { ObjectId } = await import("mongodb");

    if (ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }

    const updateFields = {
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.password) {
      updateFields.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      throw new Error("Customer not found");
    }
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  //delete customer by id

  static async delete(id) {
    const { ObjectId } = await import("mongodb");
    return this.getCollection().deleteOne({ _id: new ObjectId(id) });
  }
}
