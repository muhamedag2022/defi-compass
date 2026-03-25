# 🧭 DeFi Compass

> Your AI-powered risk advisor on HashKey Chain | 基于HashKey Chain的AI风险顾问

[![Live Demo](https://img.shields.io/badge/Live-Demo-7c3aed?style=for-the-badge)](https://defi-compass.vercel.app)
[![HashKey Chain](https://img.shields.io/badge/HashKey-Chain-a855f7?style=for-the-badge)](https://hashkey.blockscout.com)
[![AI by DGrid](https://img.shields.io/badge/AI-DGrid%20Gateway-blue?style=for-the-badge)](https://dgrid.ai)
[![Twitter](https://img.shields.io/badge/Twitter-DeFiCompassHSK-1DA1F2?style=for-the-badge)](https://x.com/DeFiCompassHSK)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge)](https://t.me/defi_compass_alert_bot)

---

## 🚨 The Problem

DeFi users on HashKey Chain face invisible risks every day:
- No affordable real-time risk monitoring tools
- Complex on-chain data that average users can't interpret
- No early warning system before losses occur
- Language barriers (English-only interfaces)

## 💡 The Solution

DeFi Compass is an AI-powered wallet risk analyzer built on HashKey Chain. It reads deep on-chain data, analyzes it using Claude AI via DGrid Gateway, and delivers clear risk scores with actionable recommendations — in seconds, in English and Chinese.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Deep Wallet Scanner** | Balance, transactions, tokens, unique contracts, total value moved |
| 🤖 **AI Risk Analysis** | Claude AI via DGrid Gateway — Risk Score 0-100 with 6 risk factors |
| 📊 **Risk Breakdown** | Concentration, Activity, Exposure bars with dynamic colors |
| 📈 **Visual Charts** | Portfolio distribution pie chart + transaction activity bar chart |
| 📱 **Telegram Alerts** | Personal alerts — each user sets their own chat ID |
| 🌐 **Bilingual** | Full English + Chinese (中文) support |
| 🔗 **Multi-wallet** | OKX Wallet, MetaMask, TokenPocket, ImToken |
| 🔓 **No login required** | Scan any public address instantly |

---

## 🏗 Architecture
```
User Wallet / Any Public Address
    ↓
HashKey Chain Mainnet (Chain ID: 177)
    ↓ viem + wagmi + Blockscout API
Deep On-chain Data:
  • HSK Balance
  • Transaction count + history
  • ERC-20 token holdings
  • Unique contracts interacted
  • Total value moved
    ↓
Claude AI via DGrid AI Gateway
  • 6-factor risk analysis
  • Risk Score 0-100
  • Actionable recommendations
    ↓
Visual Dashboard + Telegram Alert (if High Risk)
```

---

## 🤝 Ecosystem Partners

| Partner | Role |
|---|---|
| **HashKey Chain** | L2 blockchain infrastructure (Chain ID: 177) |
| **DGrid AI** (@dgrid_ai) | AI Gateway — 200+ models including Claude via single API |
| **Asseto Finance** (@AssetoFinance) | RWA assets for investment recommendations |
| **ZKGate** | ZK identity proofs — planned roadmap integration |

---

## 🛠 Tech Stack
```
Frontend:    React 18 + TypeScript + Vite + Recharts
Blockchain:  wagmi + viem (HashKey Chain mainnet)
Explorer:    HashKey Blockscout API (tokens, transactions)
AI:          DGrid AI Gateway → Claude AI (anthropic/claude-3.5-sonnet)
Alerts:      Telegram Bot API (personal chat ID per user)
Deploy:      Vercel
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

- ✅ **AI** — Claude AI via DGrid Gateway for deep risk analysis
- ✅ **DeFi** — Real on-chain wallet risk monitoring on HashKey Chain mainnet
- ✅ **PayFi** — Foundation for automated payment risk assessment
- 🔜 **ZKID** — ZKGate private identity integration (roadmap)

---

## 🗺 Roadmap

- [ ] ZKGate integration — prove KYC/compliance without revealing identity
- [ ] Asseto Finance RWA panel — real asset investment recommendations
- [ ] Multi-address portfolio view
- [ ] Historical risk score tracking
- [ ] Echo Protocol integration for safe automated actions

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
  <strong>Powered by HashKey Chain · AI by DGrid · Built for HashKey Chain Horizon Hackathon 2026</strong>
</div>