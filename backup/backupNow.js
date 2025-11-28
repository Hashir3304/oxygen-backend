import { initDB } from "../db.js";
import firestore from "../utils/firebaseAdmin.js";

export default async function backupNow() {
  const db = await initDB();
  const timestamp = Date.now();

  const customers = db.prepare("SELECT * FROM customers").all();
  const transactions = db.prepare("SELECT * FROM transactions").all();

  await firestore.collection("oxygen_backups").doc(String(timestamp)).set({
    timestamp,
    customers,
    transactions
  });

  console.log("🔥 Backup saved:", new Date(timestamp).toISOString());
}
