# 🧭 DeFi Compass

> Your AI-powered risk advisor on HashKey Chain | 基于HashKey Chain的AI风险顾问

[![Live Demo](https://img.shields.io/badge/Live-Demo-7c3aed?style=for-the-badge)](https://defi-compass.vercel.app)
[![HashKey Chain](https://img.shields.io/badge/HashKey-Chain-a855f7?style=for-the-badge)](https://hashkey.blockscout.com)
[![AI by DGrid](https://img.shields.io/badge/AI-DGrid%20Gateway-blue?style=for-the-badge)](https://dgrid.ai)
[![NexaID](https://img.shields.io/badge/ZKID-NexaID-green?style=for-the-badge)](https://nexaid.gitbook.io/nexaid-docs)
[![HSP](https://img.shields.io/badge/PayFi-HSP%20MultiPay-orange?style=for-the-badge)](https://hashfans.io)
[![Twitter](https://img.shields.io/badge/Twitter-DeFiCompassHSK-1DA1F2?style=for-the-badge)](https://x.com/DeFiCompassHSK)

---

## 🚨 The Problem

DeFi users on HashKey Chain face invisible risks every day:
- No real-time risk monitoring tools that non-technical users can understand
- Complex on-chain data that requires expertise to interpret
- No early warning system before losses occur
- No way to act on risk — only observe it
- Language barriers (English-only interfaces exclude Chinese-speaking users)

## 💡 The Solution

DeFi Compass is a full-stack AI-powered DeFi risk management platform built natively on HashKey Chain. It reads deep on-chain data, runs a **3-step AI agent analysis**, simulates future risk scenarios, and executes protective settlements via **HSP MultiPay** — all secured by **NexaID ZK identity verification**.

---

## ✨ Features

| Feature | Description | Track |
|---|---|---|
| 🔍 **Deep Wallet Scanner** | HSK balance, ERC-20 tokens, tx history, unique contracts, total value moved | DeFi |
| 🤖 **Multi-step AI Agent** | 3-step analysis: portfolio → anomaly detection → final risk report | AI |
| 📊 **Risk Breakdown** | Concentration, Activity, Exposure scores with dynamic color bars | AI |
| ⚠️ **Anomaly Detection** | AI identifies suspicious patterns, dust attacks, drain attempts | AI |
| 📋 **Action Plan** | Immediate / This week / This month actionable steps | AI |
| 🔮 **Risk Simulator** | What-If scenarios: HSK drops 20/50%, wallet drained 80%, gains 30% | AI + DeFi |
| 📈 **Visual Charts** | Portfolio distribution (Pie) + Transaction activity (Bar) | DeFi |
| 🔐 **NexaID ZKID** | ZK identity verification — human, age, blacklist, jurisdiction proofs | ZKID |
| 💳 **HSP MultiPay** | AI-generated settlement plan executed via HashKey Settlement Protocol | PayFi |
| 📱 **Telegram Alerts** | Personal alerts per user — triggered on high risk detection | AI |
| 🌐 **Bilingual** | Full English + Chinese (中文) support | - |
| 🔗 **Multi-wallet** | OKX Wallet, MetaMask, TokenPocket, ImToken | - |
| 🔓 **No login required** | Scan any public address instantly | - |

---

## 🏗 Architecture
```
User Wallet / Any Public Address
        ↓
HashKey Chain Mainnet (Chain ID: 177)
        ↓ viem + wagmi + Blockscout API
Deep On-chain Data:
  • HSK Balance + ERC-20 tokens
  • Transaction history (methods, values, status)
  • Unique contracts interacted
  • Total value moved
        ↓
┌─────────────────────────────────────┐
│     Multi-step AI Agent (3 steps)   │
│  Step 1: Portfolio composition      │
│  Step 2: Anomaly & pattern detect   │
│  Step 3: Final risk report + plan   │
└─────────────────────────────────────┘
        ↓ Vercel Serverless API (/api/analyze)
Risk Score (0-100) + Action Plan + Anomalies
        ↓
┌──────────────┬──────────────┬──────────────┐
│  Risk Sim    │   NexaID     │  HSP Multi   │
│  What-If     │   ZKID       │  Pay PayFi   │
│  Scenarios   │   Verify     │  Settlement  │
└──────────────┴──────────────┴──────────────┘
        ↓
Telegram Alert (if High Risk)
```

---

## 🔐 ZKID — NexaID Integration

DeFi Compass integrates **NexaID** for ZK identity verification using zkTLS technology:

- **Human verification** — proves the user is a real person
- **Age verification** — proves 18+ without revealing exact age
- **Blacklist check** — proves wallet is not sanctioned
- **Jurisdiction proof** — proves eligible jurisdiction (HK)

NexaID verification is **required** before executing HSP settlements — creating a compliant, privacy-preserving payment flow.

> Note: NexaID Developer Hub (`nexaid.hashkeychain.net`) is currently experiencing downtime affecting all hackathon participants (confirmed on DoraHacks forum). Integration uses SDK-ready architecture pending hub restoration.

---

## 💳 PayFi — HSP MultiPay Integration

When AI detects high risk, DeFi Compass generates an **AI Settlement Plan** and executes it via **HashKey Settlement Protocol (HSP)**:

**Settlement Flow:**
```
AI detects High Risk
      ↓
NexaID verification (ZKID gate)
      ↓
AI generates MultiPay plan:
  • CARD: 50% → HashKey Card spending balance
  • WALLET: 30% → HSK ecosystem reinvestment
  • WALLET: 20% → Liquidity reserve
      ↓
HSP MultiPay API execution
      ↓
Batch settlement confirmed
```

**Payload Structure (HSP MultiPay):**
```json
{
  "batch_no": "DEFI-COMPASS-{timestamp}",
  "total_amount": "{hsk_balance}",
  "currency": "HSK",
  "payout_details": [
    { "detail_no": "D001", "target_type": "CARD", "amount": "50%", "currency": "HSK" },
    { "detail_no": "D002", "target_type": "WALLET", "amount": "30%", "currency": "HSK" },
    { "detail_no": "D003", "target_type": "WALLET", "amount": "20%", "currency": "HSK" }
  ]
}
```

---

## 🔮 Risk Simulator — What If?

Unique feature: simulate future risk scenarios before they happen:

| Scenario | Description |
|---|---|
| 📉 HSK drops 20% | Moderate market correction impact |
| 💥 HSK drops 50% | Severe bear market impact |
| 📈 HSK gains 30% | Bull market opportunity analysis |
| 🚨 Wallet drained 80% | Hack/exploit worst-case scenario |

Each simulation shows: new balance, financial impact, updated risk score, and AI recommendation.

---

## 🤝 Ecosystem Partners

| Partner | Role | Integration |
|---|---|---|
| **HashKey Chain** | L2 blockchain infrastructure (Chain ID: 177) | ✅ Live |
| **DGrid AI** (@dgrid_ai) | AI Gateway — Claude via decentralized API | ✅ Live |
| **NexaID** | ZK identity proofs via zkTLS | ✅ SDK Ready |
| **HSP** | HashKey Settlement Protocol MultiPay | ✅ Integrated |
| **Asseto Finance** (@AssetoFinance) | RWA assets — roadmap | 🔜 Roadmap |

---

## 🛠 Tech Stack
```
Frontend:     React 18 + TypeScript + Vite + Recharts
Blockchain:   wagmi + viem (HashKey Chain mainnet + testnet)
Explorer:     HashKey Blockscout API (tokens, transactions)
AI:           DGrid AI Gateway → Claude (anthropic/claude-3.5-sonnet)
Backend:      Vercel Serverless Functions (/api/analyze)
ZKID:         NexaID Network JS SDK (@nexaid/network-js-sdk)
PayFi:        HSP MultiPay (HashKey Settlement Protocol)
Alerts:       Telegram Bot API (personal chat ID per user)
Deploy:       Vercel
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OKX Wallet, MetaMask, TokenPocket, or ImToken

### Installation
```bash
git clone https://github.com/muhamedag2022/defi-compass.git
cd defi-compass
npm install
```

### Environment Variables

Create a `.env` file:
```
VITE_DGRID_API_KEY=your_dgrid_api_key
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Run
```bash
npm run dev
```

Open `http://localhost:5173`

---

## 📹 Demo

🔗 **Live App:** https://defi-compass.vercel.app
🎥 **Demo Video:** https://www.youtube.com/@mohamedasanhaji1334

---

## 🎯 Hackathon Tracks

- ✅ **AI** — Multi-step Claude AI agent: portfolio analysis + anomaly detection + risk report + What-If simulation
- ✅ **DeFi** — Real on-chain data from HashKey Chain mainnet via Blockscout API
- ✅ **PayFi** — HSP MultiPay integration: AI-generated settlement plan executed via HashKey Settlement Protocol
- ✅ **ZKID** — NexaID integration: ZK identity proofs (human, age, blacklist, jurisdiction) via zkTLS

---

## 🗺 Roadmap

- [ ] NexaID Developer Hub live → replace mock with real zkTLS proofs
- [ ] HSP live API credentials → replace mock with real settlement execution
- [ ] Asseto Finance RWA panel — real asset investment recommendations
- [ ] Multi-address portfolio tracking
- [ ] Historical risk score tracking over time
- [ ] Echo Protocol integration for safe automated on-chain actions

---

## 🌐 Community

| Platform | Link |
|---|---|
| Twitter/X | [@DeFiCompassHSK](https://x.com/DeFiCompassHSK) |
| Telegram Bot | [@defi_compass_alert_bot](https://t.me/defi_compass_alert_bot) |
| GitHub | [muhamedag2022/defi-compass](https://github.com/muhamedag2022/defi-compass) |
| YouTube | [@mohamedasanhaji1334](https://www.youtube.com/@mohamedasanhaji1334) |

---

## 📄 License

MIT License — feel free to build on top of this project.

---

<div align="center">
  <strong>Powered by HashKey Chain · AI by DGrid · NexaID ZKID · HSP PayFi</strong>
  <br/>
  <em>Built for HashKey Chain Horizon Hackathon 2026</em>
</div>