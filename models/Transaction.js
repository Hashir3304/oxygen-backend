export async function createTransactionsTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT,
      type TEXT,
      timestamp TEXT
    );
  `);
}

export async function addTransaction(db, customerId, type) {
  const now = new Date().toISOString();
  return db.run(
    "INSERT INTO transactions (customer_id, type, timestamp) VALUES (?, ?, ?)",
    customerId, type, now
  );
}

export async function getHistory(db, customerId) {
  return db.all(
    "SELECT * FROM transactions WHERE customer_id = ? ORDER BY timestamp DESC",
    customerId
  );
}
