import express from "express";
import cors from "cors";
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
  "https://<your-customer-netlify>.netlify.app",
  "https://<your-staff-netlify>.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// init DB tables
initDB().then(async (db) => {
  await createCustomersTable(db);
  await createTransactionsTable(db);
});

app.use("/api", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", transactionRoutes);
app.use("/api", analyticsRoutes);

app.listen(8070, () => console.log("Backend running on port 8070"));
