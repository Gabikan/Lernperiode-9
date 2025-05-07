const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('finance.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    amount REAL,
    date TEXT
  )`);
});

module.exports = db;

