import { getDb } from '../db/database.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是"安颐伴"的AI养老规划师，名叫"小安"。你的角色特点：
1. 温暖亲切，像一位有经验的老朋友，用语通俗易懂
2. 擅长养老金融规划，能用大白话解释复杂概念
3. 对话中主动引导用户提供关键信息：年龄、预期退休年龄、当前存款/资产、年收入、预期退休后月开销、风险偏好
4. 从对话中结构化提取参数，在确认信息完整后提示用户"可以生成方案了"
5. 回复保持简洁，每次2-4句话，避免长篇大论
6. 适当使用亲切语气词，让中老年用户感到温暖

请用中文回复。`;

export interface ChatParams {
  message: string;
  sessionId?: string;
  userId?: number;
  dialect?: string;
}

export interface ChatResult {
  reply: string;
  sessionId: number;
  extractedParams?: {
    age?: number;
    retirementAge?: number;
    totalAssets?: number;
    annualIncome?: number;
    monthlyExpense?: number;
    riskPreference?: 'aggressive' | 'moderate' | 'conservative';
  };
}

export async function chat(params: ChatParams): Promise<ChatResult> {
  const db = getDb();
  const userId = params.userId || 1;

  // Get or create session
  let sessionId = params.sessionId ? parseInt(params.sessionId) : 0;
  if (!sessionId) {
    const result = db.prepare('INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)').run(userId, '养老规划咨询');
    sessionId = result.lastInsertRowid as number;
  }

  // Save user message
  db.prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)').run(sessionId, 'user', params.message);

  // Get conversation history
  const history = db.prepare(
    'SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC LIMIT 20'
  ).all(sessionId) as { role: string; content: string }[];

  let reply: string;
  let extractedParams = undefined;

  // Try DeepSeek API first, fallback to local mock
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (apiKey) {
    try {
      reply = await callDeepSeek(history, params.dialect, apiKey);
    } catch {
      reply = generateMockReply(params.message);
    }
  } else {
    reply = generateMockReply(params.message);
  }

  // Extract parameters from the message
  extractedParams = extractParams(params.message);

  // Save assistant reply
  db.prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)').run(sessionId, 'assistant', reply);

  return { reply, sessionId, extractedParams };
}

async function callDeepSeek(history: { role: string; content: string }[], dialect: string | undefined, apiKey: string): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + (dialect && dialect !== 'mandarin' ? `\n请用${dialect === 'sichuan' ? '四川话' : dialect === 'dongbei' ? '东北话' : '粤语'}的风格回复，但数字和日期用普通话。` : '') },
    ...history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
  ];

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  const data = await response.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

function generateMockReply(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('年龄') || msg.includes('岁') || msg.includes('多大')) {
    return '我今年35岁，在一家互联网公司工作，目前存款大概50万，年收入30万左右，想60岁退休。';
  }

  if (msg.includes('存款') || msg.includes('资产') || msg.includes('50万') || msg.includes('收入')) {
    return '好的，我记录一下。您目前总资产约50万元，年收入30万元。那您退休后每个月大概需要多少生活费呢？比如现在每月开销5000元，退休后可能也需要差不多的金额。';
  }

  if (msg.includes('开销') || msg.includes('支出') || msg.includes('5000') || msg.includes('生活费')) {
    return '明白了，每月5000元的生活费。最后一个问题，您对投资风险的看法是怎样的？是偏向保守（宁愿少赚也不愿亏），进取（愿意承担波动换取更高收益），还是居中稳健？';
  }

  if (msg.includes('保守') || msg.includes('稳健') || msg.includes('进取') || msg.includes('风险')) {
    return '好的，信息都收集齐了！让我帮您总结一下：35岁，计划60岁退休，当前资产50万，年收入30万，退休后月开销5000元，风险偏好稳健型。这些信息都正确的话，您可以点击下方的"生成方案"按钮，我来为您定制一份专属养老规划！';
  }

  if (msg.includes('生成方案') || msg.includes('方案') || msg.includes('规划')) {
    return '好的，正在为您生成专属养老规划方案！请稍候...';
  }

  // Default greeting flow
  if (msg.includes('你好') || msg.includes('您好') || msg.includes('嗨') || msg.includes('hi')) {
    return '您好！我是您的养老规划师小安。很高兴为您服务！告诉我您的年龄和目前存款情况，我们一起看看未来怎么准备吧？';
  }

  return '感谢您的信息！为了更好地为您规划，我还需要了解几个关键信息：您目前的年龄、预期退休年龄、当前总资产和年收入情况。您可以一次性告诉我，咱们慢慢聊。';
}

function extractParams(message: string): ChatResult['extractedParams'] {
  const params: NonNullable<ChatResult['extractedParams']> = {};

  const ageMatch = message.match(/(\d+)\s*岁/);
  if (ageMatch) params.age = parseInt(ageMatch[1]);

  const retireMatch = message.match(/(\d+)\s*岁.*退[休]/);
  if (retireMatch) params.retirementAge = parseInt(retireMatch[1]);

  const assetMatch = message.match(/(?:存款|资产).*?(\d+)\s*万/);
  if (assetMatch) params.totalAssets = parseInt(assetMatch[1]) * 10000;

  const incomeMatch = message.match(/(?:年收入|收入).*?(\d+)\s*万/);
  if (incomeMatch) params.annualIncome = parseInt(incomeMatch[1]) * 10000;

  const expenseMatch = message.match(/(?:开销|生活费|支出).*?(\d+)\s*[元块]/);
  if (expenseMatch) params.monthlyExpense = parseInt(expenseMatch[1]);

  if (message.includes('保守')) params.riskPreference = 'conservative';
  else if (message.includes('进取') || message.includes('激进')) params.riskPreference = 'aggressive';
  else if (message.includes('稳健')) params.riskPreference = 'moderate';

  return Object.keys(params).length > 0 ? params : undefined;
}