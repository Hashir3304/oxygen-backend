import { initDB } from "../db.js";
import firestore from "../utils/firebaseAdmin.js";

export default async function restoreFromBackup(timestamp) {
  const db = await initDB();

  const doc = await firestore.collection("oxygen_backups").doc(String(timestamp)).get();
  if (!doc.exists) throw new Error("Backup not found");

  const { customers, transactions } = doc.data();

  // Clear tables
  db.prepare("DELETE FROM customers").run();
  db.prepare("DELETE FROM transactions").run();

  // Insert customers
  const insertCustomer = db.prepare("INSERT INTO customers (uid, email, name, stamps, visits, rewards, lastStampDate, qrCode, activities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (let c of customers) {
    insertCustomer.run(c.uid, c.email, c.name, c.stamps, c.visits, c.rewards, c.lastStampDate, c.qrCode, JSON.stringify(c.activities));
  }

  // Insert transactions
  const insertTxn = db.prepare("INSERT INTO transactions (id, customerId, type, date, rewardValue, qrCode) VALUES (?, ?, ?, ?, ?, ?)");
  for (let t of transactions) {
    insertTxn.run(t.id, t.customerId, t.type, t.date, t.rewardValue, t.qrCode);
  }

  console.log("🔥 Restore completed from backup:", new Date(timestamp).toISOString());
}
