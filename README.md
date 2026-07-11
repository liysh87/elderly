# 安颐伴 Anyibang - 智慧养老综合服务平台
> AI原生适老化养老金融Web Demo | React + TS + Vite 全栈开源演示项目

## 📖 项目简介（Product Concept）
**安颐伴**，寓意「安享晚年，颐养天年，AI相伴」，是一款面向35-75岁中老年人群及其子女关怀者的轻量化H5养老金融服务平台。
传统养老理财存在规划门槛高、长辈操作困难、工具数据割裂三大痛点，本产品以**AI对话交互**为核心，融合方言语音、桌面灵宠陪伴、动态资产沙盘三大差异化特色，把复杂的养老储蓄、投资、保险规划转化为聊天式极简操作，实现从“用户被动查询”到“AI主动陪伴规划”的养老服务升级。

产品吉祥物为「小禄鹿」桌面灵宠，取“禄（福气）+鹿（长寿）”谐音，作为全局悬浮交互彩蛋，定时推送资产简报、收益预警，弱化金融产品冰冷感，打造温暖适老化服务体验。
**Slogan：让养老更智慧**

### 核心差异化亮点
1. 多地方言语音交互：普通话/四川话/东北话/粤语原生语音识别播报，适配老年用户使用习惯
2. AI对话式养老规划：3分钟对话生成储蓄+投资+保险三合一养老方案，一键可视化推演
3. 桌面灵宠陪伴系统：状态驱动悬浮宠物，消息提醒、每日资产简报一站式推送
4. 全链路数据闭环：AI规划师 → 退休沙盘可视化 → 语音管家查询 → 灵宠消息联动，数据互通无割裂

## 🛠️ 技术栈实现（Tech Stack）
### 前端（Vite + React + TypeScript 脚手架，本项目基础模板）
基于官方 `React + TS + Vite` 模板构建，选用SWC编译提速，配套完整TypeScript类型约束与ESLint强类型校验
| 模块 | 技术选型 | 用途 |
|------|---------|------|
| 核心框架 | React 18 + TypeScript 5.8 | 页面渲染、全局类型约束 |
| 构建工具 | Vite 6 | 极速HMR热更新、生产打包优化 |
| 样式方案 | Tailwind CSS 3 | 适老化大圆角、高对比度UI快速开发 |
| 状态管理 | Zustand 5 | 用户资产、灵宠状态、规划方案全局状态 |
| 路由 | React Router HashRouter | 兼容静态对象存储托管，无需后端路由重写 |
| 图表可视化 | Recharts | 退休沙盘资产曲线图、动态参数联动滑块 |
| 语音能力 | Web Speech API | 浏览器原生语音识别、声波动态交互动画 |
| UI图标 | Lucide React | 简洁高辨识度适老化图标 |

### 后端
- 服务框架：Express.js + TypeScript
- 数据库：SQLite（嵌入式零配置，Demo演示轻量化存储）
- AI能力：DeepSeek API 大模型，负责对话理解、养老方案生成、资产测算
- 接口分层：对话AI路由、用户资产路由、市场模拟数据路由

### 部署方案（国内可直接访问，无需翻墙）
1. 主节点：腾讯云COS广州静态网站托管（国内低延迟，<50ms访问速度）
2. 加速链路：COS全球加速域名，跨地域访问优化
3. 备用节点：Vercel Edge Network，双链路容灾备份
4. 托管特性：纯静态前端打包产物，零服务器运维、弹性高可用

## 🧩 核心功能模块（Feature Overview）
### 1. 首页仪表盘
总资产动画卡片、四大功能快捷入口、右下角悬浮「小禄鹿」灵宠组件，打开即可查看当日收益、资产总览，长辈无需复杂跳转。

### 2. AI智能养老规划师
对话式交互界面，AI主动引导收集年龄、存款、每月开销等信息，自动生成储蓄/投资/保险三合一完整养老报告；支持延迟退休、增减定投等场景一键对比，方案可直接同步至沙盘可视化。

### 3. 动态退休资产沙盘
横轴年龄、纵轴总资产可视化曲线，搭配可拖拽自定义滑竿（预期寿命、年化收益、月度支出），参数实时联动曲线变化，直观模拟未来几十年资产走势。

### 4. 方言语音交互管家
全屏语音交互模式，动态声波动画；支持一句话查询余额、持仓收益、理财产品，四种方言切换播报结果，解决长辈打字困难痛点。

### 5. 子女关怀模式
支持父母账号绑定，子女一键切换查看长辈资产概况，接收余额不足、产品到期、市场波动风险预警，远程协助完成养老规划。

### 6. 桌面灵宠「小禄鹿」彩蛋系统
完整状态机动画：空闲张望、新消息蹦跳提醒、点击展开每日市场简报；支持切换宠物皮肤、调整活泼性格，定时推送早晚资产日报、定投提醒。

### 7. 隐私安全适配适老场景
资产金额一键隐藏、指纹/面容锁、本地敏感数据加密、账号注销、个性化广告关闭、全量个人数据导出，覆盖老年用户资产隐私需求；配套7类消息通知自定义开关，可设置免打扰时段。

### 8. 多渠道登录体系
微信/手机号验证码/QQ/微博四种登录方式，内置预设演示账号（张阿姨本人账号、子女李明账号），开箱即可完整演示全功能。

## 📂 项目目录结构
```
/workspace/
├── src/                          # 前端源码
│   ├── components/               # 通用复用组件（灵宠、声波、聊天气泡、滑块）
│   ├── pages/                    # 全页面组件（首页/规划师/沙盘/语音/个人中心等8大页面）
│   ├── hooks/                    # 自定义逻辑钩子（AI对话、语音识别）
│   ├── stores/                   # Zustand全局状态（用户/灵宠/规划方案）
│   ├── App.tsx / main.tsx        # 项目入口，包含微信浏览器适配检测
│   └── index.css                 # 全局样式、动画定义
├── api/                          # Express后端接口、数据库、AI服务封装
├── dist/                         # Vite生产构建产物
├── vite.config.ts                # Vite编译配置（SWC React插件、TS校验）
├── vercel.json                   # Vercel备用部署配置
└── .trae/documents/              # 完整产品PRD、技术架构文档
```

## 🚀 快速访问 Demo
| 访问优先级 | 部署平台 | 在线链接 |
|-----------|---------|---------|
| 首选（国内） | 腾讯云COS广州 | https://anyibang-1451380136.cos-website.ap-guangzhou.myqcloud.com |
| 国内加速 | COS全球加速 | https://anyibang-1451380136.cos.accelerate.myqcloud.com/index.html |
| 海外备用 | Vercel | https://workspace-nu-seven-45.vercel.app |
| 视频录制 | 腾讯会议 | https://meeting.tencent.com/crm/Nbg6JAjAcd |

*若平台部署链接打开为空白或无法访问，可能是托管路由匹配问题，建议打开录制的演示视频直接查看，或将文件下载至电脑进行本地化部署*

## 📅 技术迭代路线
### Phase1（✅ 已完成，当前Demo版本）
完成全部适老化核心演示功能，Vite+TS前端脚手架搭建、AI大模型对话集成、语音交互、灵宠系统、静态多平台部署，可完整对外演示产品概念。
### Phase2（近期规划·生产化升级）
1. 后端独立云服务器部署，JWT安全认证，API后端代理规避前端密钥泄露风险
2. 接入真实金融行情API、腾讯云方言TTS语音合成
3. 微信公众号生态打通，自定义域名HTTPS，完善自动化测试、日志监控告警
### Phase3（中期·平台生态拓展）
SQLite迁移PostgreSQL，上线子女绑定完整关怀体系、社区养老话题、智能投顾资产组合优化、社保/医保政务数据对接
### Phase4（长期·开放平台愿景）
搭建金融机构开放API、自研自主决策AI养老Agent、智能硬件音箱/穿戴设备联动、微服务分布式架构重构

## 🎯 项目价值与适用场景
1. **养老金融产品原型演示**：面向银行、保险机构展示适老化AI服务创新方案
2. **前端全栈技术Demo**：Vite+React+TS+AI集成完整开源案例，适用于Web技术学习、毕业设计
3. **适老化交互设计参考**：针对中老年用户的无障碍、方言语音、低门槛交互落地范本
4. **AI大模型Web应用实践**：LLM对话落地轻量化H5产品的完整工程化实现

---


## Anyibang 安颐伴 - AI智慧养老综合服务平台
A React+TS+Vite powered elderly-oriented financial H5 demo with native AI assistant & dialect voice interaction

### Product Intro
Anyibang is an AI-native pension planning web application for elders and their children. It transforms complex retirement financial planning into chat-style operation, with unique features including multi-dialect voice interaction, desktop pet companion, dynamic asset sandbox simulation, solving high threshold, hard operation & data isolation pain points of traditional wealth management tools.

### Tech Stack
- Frontend: React 18 + TypeScript + Vite 6 + TailwindCSS + Zustand + Recharts
- Backend: Express.js + SQLite
- AI Service: DeepSeek LLM for conversation & pension plan generation
- Deploy: Tencent COS (CN low-latency) + Vercel backup, static SPA hosted with HashRouter

### Core Features
✅ AI Chat Pension Planner | Generate 3-in-1 saving/investment/insurance report
✅ Dynamic Retirement Asset Sandbox | Real-time curve simulation with drag sliders
✅ Multi-Dialect Voice Butler | Mandarin/Sichuan/Northeast/Cantonese speech support
✅ Desktop Pet "Little Deer" Widget | Notification & daily brief companion animation
✅ Children Care Mode | Cross-account asset overview & risk alert
✅ Elder-friendly UI | Large button, high contrast, font zoom, privacy lock
✅ No-download H5 | Direct access via browser & WeChat embedded view

### Project Structure
Frontend source under `/src`, Express backend in `/api`, full PRD & architecture docs stored in `.trae/documents`
Built on official Vite+React-TS template with strict TypeScript lint rules.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
