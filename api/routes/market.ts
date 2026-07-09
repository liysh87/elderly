import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/market/overview
router.get('/overview', (req: Request, res: Response) => {
  const data = {
    pensionIndex: [
      { name: '养老产业指数', value: 3856.72, change: 1.25 },
      { name: '中证养老', value: 4521.38, change: -0.32 },
      { name: '医疗健康', value: 6234.15, change: 0.87 },
    ],
    bondYield: 2.65,
    inflationRate: 2.3,
    fofBenchmark: [
      { name: '安颐稳健养老FOF', return1y: 4.8, return3y: 15.2 },
      { name: '安颐平衡养老FOF', return1y: 6.2, return3y: 18.7 },
      { name: '安颐进取养老FOF', return1y: 8.5, return3y: 22.1 },
    ],
    petBriefing: {
      morning: '今日养老板块参考：养老产业指数上涨1.25%，市场整体稳健。',
      afternoon: '今日您的养老金预估收益+128.50元，本月累计收益+856.30元。',
    },
  };
  res.json(data);
});

export default router;