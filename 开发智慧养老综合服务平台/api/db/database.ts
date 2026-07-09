import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'anyiban.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
    seedData(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      phone TEXT UNIQUE,
      email TEXT UNIQUE,
      age INTEGER DEFAULT 35,
      dialect TEXT DEFAULT 'mandarin',
      risk_preference TEXT DEFAULT 'moderate',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL DEFAULT 500000,
      monthly_pension REAL DEFAULT 0,
      pension_date TEXT DEFAULT '每月15日',
      yesterday_return REAL DEFAULT 0,
      yield_rate REAL DEFAULT 3.5,
      monthly_change REAL DEFAULT 0.5,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'completed',
      date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT DEFAULT '新对话',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      age INTEGER NOT NULL,
      retirement_age INTEGER NOT NULL,
      total_assets REAL NOT NULL,
      annual_income REAL NOT NULL,
      monthly_expense REAL NOT NULL,
      risk_preference TEXT NOT NULL,
      plan_data TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS holdings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      market_value REAL NOT NULL,
      return_rate REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function seedData(db: Database.Database) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (name, phone, email, age, dialect, risk_preference)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = insertUser.run('张阿姨', '13800138000', 'zhang@example.com', 58, 'mandarin', 'moderate');
  const userId = result.lastInsertRowid as number;

  db.prepare(`
    INSERT INTO assets (user_id, total_amount, monthly_pension, pension_date, yesterday_return, yield_rate, monthly_change)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, 680000, 3200, '每月15日', 128.50, 4.2, 0.8);

  db.prepare(`INSERT INTO transactions (user_id, type, amount, status, date) VALUES (?, ?, ?, ?, ?)`).run(userId, '定投扣款', 2000, 'completed', '2026-07-01');
  db.prepare(`INSERT INTO transactions (user_id, type, amount, status, date) VALUES (?, ?, ?, ?, ?)`).run(userId, '养老金到账', 3200, 'completed', '2026-06-15');
  db.prepare(`INSERT INTO transactions (user_id, type, amount, status, date) VALUES (?, ?, ?, ?, ?)`).run(userId, '收益入账', 128.50, 'completed', '2026-07-06');

  db.prepare(`INSERT INTO holdings (user_id, name, type, market_value, return_rate) VALUES (?, ?, ?, ?, ?)`).run(userId, '安颐稳健养老FOF', '基金', 350000, 4.8);
  db.prepare(`INSERT INTO holdings (user_id, name, type, market_value, return_rate) VALUES (?, ?, ?, ?, ?)`).run(userId, '安颐纯债债券A', '基金', 200000, 3.2);
  db.prepare(`INSERT INTO holdings (user_id, name, type, market_value, return_rate) VALUES (?, ?, ?, ?, ?)`).run(userId, '安颐终身寿险（万能型）', '保险', 130000, 3.5);
}