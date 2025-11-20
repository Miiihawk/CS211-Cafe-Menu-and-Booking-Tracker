import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust as needed for your frontend
    credentials: true,
  })
);

app.use("/authentication", authRoute);
app.use("/admin", adminRoute);
app.use("/uploads", express.static("uploads"));
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
