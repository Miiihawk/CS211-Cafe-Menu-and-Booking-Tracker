import { getCollection } from "../config/database";
import { ObjectId } from "mongodb";

export class Package {
  static collection() {
    return getCollection("packages");
  }

  static async getAll() {
    return await this.collection().find().toArray();
  }

  static async findById(id) {
    return this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    return this.collection().insertOne({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static async update(id, updates) {
    return this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updated_at: new Date() } }
    );
  }

  static async delete(id) {
    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }

  static async toObjectId(id) {
    const { ObjectId } = await import("mongodb");
    return new ObjectId(id);
  }

  static async toObjectIdArray(ids = []) {
    const { ObjectId } = await import("mongodb");
    return ids.map((id) => new ObjectId(id));
  }
}
