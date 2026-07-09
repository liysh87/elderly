import { Router, Request, Response } from 'express';
import { chat } from '../services/aiService.js';
import { calculatePlan, generateProjection, type PlanParams } from '../services/planService.js';
import { getDb } from '../db/database.js';

const router = Router();

// POST /api/chat/send
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userId, dialect } = req.body;
    if (!message) {
      res.status(400).json({ error: '消息不能为空' });
      return;
    }
    const result = await chat({ message, sessionId, userId, dialect });
    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: '对话服务异常' });
  }
});

// POST /api/chat/generate-plan
router.post('/generate-plan', (req: Request, res: Response) => {
  try {
    const params: PlanParams = req.body;
    if (!params.age || !params.retirementAge || !params.totalAssets) {
      res.status(400).json({ error: '参数不完整，需要年龄、退休年龄和总资产' });
      return;
    }
    const plan = calculatePlan(params);

    // Save to database
    const db = getDb();
    db.prepare(`
      INSERT INTO plans (user_id, age, retirement_age, total_assets, annual_income, monthly_expense, risk_preference, plan_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.body.userId || 1,
      params.age,
      params.retirementAge,
      params.totalAssets,
      params.annualIncome,
      params.monthlyExpense,
      params.riskPreference,
      JSON.stringify(plan)
    );

    res.json(plan);
  } catch (err) {
    console.error('Plan generation error:', err);
    res.status(500).json({ error: '方案生成失败' });
  }
});

// POST /api/chat/projection
router.post('/projection', (req: Request, res: Response) => {
  try {
    const { age, retirementAge, totalAssets, monthlyInvest, annualReturn, monthlyExpense, lifeExpectancy } = req.body;
    const data = generateProjection({
      age: age || 35,
      retirementAge: retirementAge || 60,
      totalAssets: totalAssets || 500000,
      monthlyInvest: monthlyInvest || 2000,
      annualReturn: annualReturn || 5,
      monthlyExpense: monthlyExpense || 5000,
      lifeExpectancy: lifeExpectancy || 90,
    });
    res.json(data);
  } catch (err) {
    console.error('Projection error:', err);
    res.status(500).json({ error: '推演失败' });
  }
});

// GET /api/chat/sessions
router.get('/sessions', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const sessions = db.prepare('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC').all(1);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: '获取会话失败' });
  }
});

// GET /api/chat/messages/:sessionId
router.get('/messages/:sessionId', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const messages = db.prepare(
      'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC'
    ).all(parseInt(req.params.sessionId));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: '获取消息失败' });
  }
});

export default router;