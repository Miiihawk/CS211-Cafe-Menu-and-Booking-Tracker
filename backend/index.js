import express from "express";
import dotenv from "dotenv";
import mongodb from "mongodb";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // temporary for local testing

app.use(express.json()); //middleware tp parse JSON bodies
//http to serialize data into strings
//deserialize string into data

app.use(express.urlencoded({ extended: true })); //middleware to parse URL-encoded bodies

//MongoDb Connection Setup
const client = new mongodb.MongoClient(process.env.MONGODB_URL);
const dbName = process.env.MONGODB_NAME || "cafe_tracker_db";
const db = client.db(dbName);
const customersCollection = db.collection("customers");

// Bookings collection
const bookingsCollection = db.collection("bookings");

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // ensure default admin exists
    try {
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "1234";

      const existingAdmin = await customersCollection.findOne({
        $or: [{ username: adminUsername }, { email: adminEmail }],
      });

      if (!existingAdmin) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        const adminDoc = {
          username: adminUsername,
          email: adminEmail,
          password: hashed,
          role: "admin",
          isAdmin: true,
          first_name: "Admin",
          last_name: "User",
          phone: "09123456789",
          created_at: new Date(),
        };
        await customersCollection.insertOne(adminDoc);
        console.log(`Default admin created: ${adminUsername} (${adminEmail})`);
      } else {
        console.log(
          "Admin account exists:",
          existingAdmin.username || existingAdmin.email
        );
      }
    } catch (err) {
      console.error("Error ensuring default admin:", err.message || err);
    }
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Routes Entities=Customer
// GET /customers - Retrieve all customers
// POST /customers - Add a new customer
// GET /customers/:id - Retrieve a specific customer by ID
// PUT /customers/:id - Update a specific customer by ID
// DELETE /customers/:id - Delete a specific customer by ID

//Routes would go here CRUD operations for users
//Protected routes would require authentication middleware
app.post("/customers", authenticateToken, async (req, res) => {
  try {
    //username, email, first_name, last_name, date_of_birth, phone_number, address
    const { username, email, password, first_name, last_name } = req.body;
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "username, email, password, first_name, last_name are required",
      });
    }

    const newCustomer = { ...req.body, created_at: new Date() };
    const result = await customersCollection.insertOne(newCustomer);

    res
      .status(201)
      .json({ message: "Customer created", customerId: result.insertedId });
  } catch (error) {
    res.status(500).json({
      message: "Error creating customer",
      details: error.message,
    });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const { username, email } = req.query; //object destructuring
    let filter = {};

    if (username) filter.username = username;
    if (email) filter.email = email;

    const customers = await customersCollection.find(filter).toArray();
    res.status(200).json({ data: customers, count: customers.length });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      details: error.message,
    });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer = await customersCollection.findOne({
      _id: new mongodb.ObjectId(id),
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      details: error.message,
    });
  }
});

app.put("/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    // Optional: Validate required fields if necessary
    const { username, email, password, first_name, last_name } = req.body;
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "username, email, password, first_name, last_name are required",
      });
    }
    const updatedCustomer = { ...req.body, updated_at: new Date() };
    const result = await customersCollection.updateOne(
      { _id: new mongodb.ObjectId(id) },
      { $set: updatedCustomer }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating customer",
      details: error.message,
    });
  }
});

app.delete("/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const result = await customersCollection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting customer",
      details: error.message,
    });
  }
});

app.post("/generateToken", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
});

/* Booking CRUD
   - POST   /bookings        (protected) create a new booking
   - GET    /bookings        list bookings (optional query: user, status)
   - GET    /bookings/:id    retrieve a single booking
   - PUT    /bookings/:id    (protected) update a booking
   - DELETE /bookings/:id    (protected) delete a booking
*/

app.post("/bookings", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let verifiedUser = null;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        verifiedUser = null;
      }
    }

    const {
      eventAddress,
      firstName,
      lastName,
      phone,
      eventDate,
      packageId,
      quantity,
      paymentMethod,
      merchandiseSubtotal,
      shippingFee,
      handlingFee,
      totalPayment,
      notes,
      status,
    } = req.body;

    if (
      !eventAddress ||
      !firstName ||
      !lastName ||
      !phone ||
      !packageId ||
      !quantity ||
      !eventDate
    ) {
      return res
        .status(400)
        .json({
          message: "Missing required booking fields (including eventDate)",
        });
    }

    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid eventDate format" });
    }

    const newBooking = {
      user: verifiedUser?.username || null,
      eventAddress,
      eventDate: eventDateObj,
      firstName,
      lastName,
      phone,
      packageId,
      quantity: Number(quantity),
      paymentMethod: paymentMethod || "cod",
      merchandiseSubtotal: Number(merchandiseSubtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      handlingFee: Number(handlingFee) || 0,
      totalPayment: Number(totalPayment) || 0,
      notes: notes || "",
      status: status || "pending",
      created_at: new Date(),
      updated_at: null,
    };

    const result = await bookingsCollection.insertOne(newBooking);
    res
      .status(201)
      .json({ message: "Booking created", bookingId: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", details: error.message });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const { user, status } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (status) filter.status = status;

    const bookings = await bookingsCollection.find(filter).toArray();
    res.status(200).json({ data: bookings, count: bookings.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", details: error.message });
  }
});

app.get("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    const booking = await bookingsCollection.findOne({
      _id: new mongodb.ObjectId(id),
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ data: booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", details: error.message });
  }
});

app.put("/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid booking ID" });

    const updates = { ...req.body, updated_at: new Date() };
    // prevent overwriting _id
    delete updates._id;

    const result = await bookingsCollection.updateOne(
      { _id: new mongodb.ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", details: error.message });
  }
});

app.delete("/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid booking ID" });

    const result = await bookingsCollection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting booking", details: error.message });
  }
});

// add signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, username } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "firstName, lastName, email and password are required",
      });
    }

    const existing = await customersCollection.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const userDoc = {
      username: username || email.split("@")[0],
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      created_at: new Date(),
    };

    const result = await customersCollection.insertOne(userDoc);

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Server misconfiguration: JWT_SECRET not set" });
    }

    const token = jwt.sign(
      { username: userDoc.username, email: userDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ message: "User created", userId: result.insertedId, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", details: error.message });
  }
});

// add login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await customersCollection.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Server misconfiguration: JWT_SECRET not set" });
    }

    // determine admin flag from stored user document (support either `isAdmin` boolean or `role: 'admin'`)
    const isAdmin = !!user.isAdmin || user.role === "admin";
    const payload = { username: user.username, email: user.email, isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // return token and admin flag (frontend can use either)
    res.status(200).json({ token, isAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in", details: error.message });
  }
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
