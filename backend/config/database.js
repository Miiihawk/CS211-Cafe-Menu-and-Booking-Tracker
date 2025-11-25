import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_NAME || "LocalCafeDB";

let db = null;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to database:", dbName);
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase first.");
  }
  return db;
};

export const getCollection = (collectionName) => {
  return getDatabase().collection(collectionName);
};

export default { connectToDatabase, getDatabase, getCollection };
