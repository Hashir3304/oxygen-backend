import express from "express";
import { initDB } from "../db.js";
import {
  getCustomer,
  updateStamps,
  redeemReward,
  incrementVisit
} from "../models/Customer.js";

import { addTransaction } from "../models/Transaction.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const db = await initDB();
  const customer = await getCustomer(db, req.params.id);
  res.json(customer);
});

router.post("/add-stamp", async (req, res) => {
  const { customerId } = req.body;

  const db = await initDB();
  const customer = await getCustomer(db, customerId);

  const newStamps = Math.min(customer.stamps + 1, 9);

  await updateStamps(db, customerId, newStamps);
  await incrementVisit(db, customerId);
  await addTransaction(db, customerId, "stamp");

  res.json({ ok: true, stamps: newStamps });
});

router.post("/redeem", async (req, res) => {
  const { customerId } = req.body;

  const db = await initDB();
  await redeemReward(db, customerId);
  await addTransaction(db, customerId, "redeem");

  res.json({ ok: true });
});

router.post("/delete", async (req, res) => {
  const { customerId } = req.body;
  const db = await initDB();

  await db.run("DELETE FROM customers WHERE id = ?", [customerId]);
  await db.run("DELETE FROM transactions WHERE customer_id = ?", [customerId]);

  res.json({ success: true });
});

export default router;
