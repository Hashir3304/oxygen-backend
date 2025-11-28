export async function createCustomersTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      stamps INTEGER DEFAULT 0,
      visits INTEGER DEFAULT 0,
      rewards INTEGER DEFAULT 0,
      joined_at TEXT
    );
  `);
}

export async function getCustomer(db, id) {
  return db.get("SELECT * FROM customers WHERE id = ?", id);
}

export async function updateStamps(db, id, stamps) {
  return db.run("UPDATE customers SET stamps = ? WHERE id = ?", stamps, id);
}

export async function incrementVisit(db, id) {
  return db.run("UPDATE customers SET visits = visits + 1 WHERE id = ?", id);
}

export async function redeemReward(db, id) {
  return db.run(`
      UPDATE customers
      SET stamps = 0,
          rewards = rewards + 1
      WHERE id = ?
  `, id);
}
