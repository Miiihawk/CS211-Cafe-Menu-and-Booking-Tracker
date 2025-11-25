import { getCollection } from "../config/database.js";
import bcrypt from "bcrypt";

//admin model

export class Admin {
  static collection() {
    return getCollection("admins");
  }
  static async findByEmail(email) {
    return await this.collection().findOne({ email });
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = {
      ...data,
      password: hashedPassword,
      role: "admin",
      is_active: data.is_active ?? true,
      createdAt: new Date(),
      last_login: data.last_login ?? null,
    };

    return this.collection().insertOne(admin);
  }

  static async update(id, updates) {
    const { ObjectId } = await import("mongodb");

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid admin ID");
    }

    const updateFields = {
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await this.getcollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      throw new Error("Admin not found");
    }
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async getAll() {
    return this.collection().find({}).toArray();
  }

  static async findById(id) {
    const { ObjectId } = await import("mongodb");
    return this.collection().findOne({ _id: new ObjectId(id) });
  }
}
