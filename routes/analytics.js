import express from "express";
import { initDB } from "../db.js";

const router = express.Router();

router.get("/daily", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT substr(timestamp, 1, 10) as day,
           COUNT(*) as count
    FROM transactions
    GROUP BY day
    ORDER BY day DESC
    LIMIT 7
  `);
  res.json({ success: true, data: rows });
});

router.get("/hourly", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT strftime('%H', timestamp) as hour,
           COUNT(*) as count
    FROM transactions
    GROUP BY hour
    ORDER BY hour ASC
  `);
  res.json({ success: true, data: rows });
});

// WEEKLY STAMPS
router.get("/weekly-stamps", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT strftime('%W', timestamp) AS week, COUNT(*) AS count
    FROM transactions
    WHERE type = 'stamp'
    GROUP BY week
    ORDER BY week DESC
    LIMIT 4
  `);
  res.json({ success: true, data: rows });
});

// MONTHLY REWARDS
router.get("/monthly-rewards", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT strftime('%m', timestamp) AS month, COUNT(*) AS count
    FROM transactions
    WHERE type = 'redeem'
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `);
  res.json({ success: true, data: rows });
});

// TOP CUSTOMERS
router.get("/top-customers", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT c.name, COUNT(t.id) AS scans
    FROM transactions t
    LEFT JOIN customers c ON c.id = t.customer_id
    GROUP BY t.customer_id
    ORDER BY scans DESC
    LIMIT 10
  `);
  res.json({ success: true, data: rows });
});

// TOP STAFF
router.get("/top-staff", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(`
    SELECT customer_id, COUNT(*) AS scans
    FROM transactions
    GROUP BY customer_id
    ORDER BY scans DESC
    LIMIT 10
  `);
  res.json({ success: true, data: rows });
});

// TOTALS
router.get("/totals", async (req, res) => {
  const db = await initDB();
  const customers = await db.get(`SELECT COUNT(*) AS total FROM customers`);
  const scans = await db.get(`SELECT COUNT(*) AS total FROM transactions`);
  const rewards = await db.get(`
    SELECT COUNT(*) AS total
    FROM transactions WHERE type = 'redeem'
  `);

  res.json({
    success: true,
    data: {
      totalCustomers: customers.total,
      totalScans: scans.total,
      totalRewards: rewards.total
    }
  });
});

export default router;
