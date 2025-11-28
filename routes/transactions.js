import express from "express";
import { initDB } from "../db.js";
import { getHistory } from "../models/Transaction.js";

const router = express.Router();

router.get("/:customerId", async (req, res) => {
  const db = await initDB();
  const history = await getHistory(db, req.params.customerId);
  res.json(history);
});

router.get("/recent", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT t.id, t.timestamp, t.customer_id, t.type,
           c.name, c.stamps
    FROM transactions t
    LEFT JOIN customers c ON t.customer_id = c.id
    ORDER BY t.timestamp DESC
    LIMIT 50
  `);
  res.json({ success: true, data: rows });
});

export default router;
