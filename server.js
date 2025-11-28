import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/auth.js";
import { initDB } from "./db.js";
import { createCustomersTable } from "./models/Customer.js";
import { createTransactionsTable } from "./models/Transaction.js";

import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import transactionRoutes from "./routes/transactions.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://oxygen-customer.netlify.app",
  "https://oxygen-staff.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use("/api", authMiddleware);

// init DB tables
initDB().then(async (db) => {
  await createCustomersTable(db);
  await createTransactionsTable(db);
});

app.use("/api", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", transactionRoutes);
app.use("/api", analyticsRoutes);

// Start backup system
import "./backup/index.js";

app.listen(8070, () => console.log("Backend running on port 8070"));
