import { Router, Request, Response } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// GET /api/user/assets
router.get('/assets', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const userId = 1;
    const asset = db.prepare('SELECT * FROM assets WHERE user_id = ?').get(userId) as any;
    if (!asset) {
      res.json({
        totalAssets: 0,
        monthlyPension: 0,
        pensionDate: '',
        yesterdayReturn: 0,
        yieldRate: 0,
        monthlyChange: 0,
      });
      return;
    }
    res.json({
      totalAssets: asset.total_amount,
      monthlyPension: asset.monthly_pension,
      pensionDate: asset.pension_date,
      yesterdayReturn: asset.yesterday_return,
      yieldRate: asset.yield_rate,
      monthlyChange: asset.monthly_change,
    });
  } catch (err) {
    res.status(500).json({ error: '获取资产信息失败' });
  }
});

// GET /api/user/holdings
router.get('/holdings', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const items = db.prepare('SELECT name, type, market_value as marketValue, return_rate as returnRate FROM holdings WHERE user_id = ?').all(1);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: '获取持仓失败' });
  }
});

// GET /api/user/transactions
router.get('/transactions', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const items = db.prepare('SELECT date, type, amount, status FROM transactions WHERE user_id = ? ORDER BY date DESC').all(1);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: '获取交易记录失败' });
  }
});

// GET /api/user/profile
router.get('/profile', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, name, phone, email, age, dialect, risk_preference FROM users WHERE id = ?').get(1) as any;
    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      age: user.age,
      dialect: user.dialect,
      riskPreference: user.risk_preference,
    });
  } catch (err) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// PUT /api/user/profile
router.put('/profile', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { name, age, dialect, riskPreference } = req.body;
    db.prepare('UPDATE users SET name = ?, age = ?, dialect = ?, risk_preference = ? WHERE id = ?')
      .run(name, age, dialect, riskPreference, 1);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

export default router;