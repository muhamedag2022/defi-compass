# 🧭 DeFi Compass

> Your AI-powered risk advisor on HashKey Chain | 基于HashKey Chain的AI风险顾问

[![Live Demo](https://img.shields.io/badge/Live-Demo-7c3aed?style=for-the-badge)](https://defi-compass.vercel.app)
[![HashKey Chain](https://img.shields.io/badge/HashKey-Chain-a855f7?style=for-the-badge)](https://hashkey.blockscout.com)
[![Built with Claude](https://img.shields.io/badge/AI-DGrid%20Gateway-blue?style=for-the-badge)](https://dgrid.ai)

---

## 🚨 The Problem

DeFi users on HashKey Chain face invisible risks every day:
- No affordable real-time risk monitoring tools
- Complex on-chain data that average users can't interpret
- No early warning system before losses occur
- Language barriers (English-only interfaces)

## 💡 The Solution

DeFi Compass is an AI-powered wallet risk analyzer built on HashKey Chain. It reads on-chain data, analyzes it using AI, and delivers clear risk scores with actionable recommendations — in seconds, in English and Chinese.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Wallet Scanner** | Reads real on-chain data from HashKey Chain mainnet |
| 🤖 **AI Risk Analysis** | Claude AI via DGrid Gateway generates risk score 0-100 |
| 📊 **Risk Report** | Clear explanation + actionable recommendations |
| 📱 **Telegram Alerts** | Instant notification when high risk is detected |
| 🌐 **Bilingual** | Full English + Chinese (中文) support |
| 🔗 **Multi-wallet** | OKX Wallet, MetaMask, TokenPocket, ImToken |

---

## 🏗 Architecture
```
User Wallet
    ↓
HashKey Chain (Chain ID: 177)
    ↓ viem + wagmi
On-chain Data (Balance, Tx Count)
    ↓
DGrid AI Gateway (Claude AI)
    ↓
Risk Score + Recommendations
    ↓
Telegram Alert (if High Risk)
```

---

## 🤝 Ecosystem Partners

| Partner | Role |
|---|---|
| **HashKey Chain** | L2 blockchain infrastructure |
| **DGrid AI** (@dgrid_ai) | AI Gateway — 200+ models via single API |
| **ZKGate** | ZK identity proofs (integration ready) |
| **Asseto Finance** (@AssetoFinance) | RWA assets for investment recommendations |

---

## 🛠 Tech Stack
```
Frontend:   React 18 + TypeScript + Vite
Blockchain: wagmi + viem (HashKey Chain mainnet)
AI:         DGrid AI Gateway (Claude AI)
Alerts:     Telegram Bot API
Deploy:     Vercel
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or OKX Wallet

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

🔗 **Live:** https://defi-compass.vercel.app

---

## 🎯 Hackathon Tracks

- ✅ **AI** — Claude AI via DGrid Gateway for risk analysis
- ✅ **DeFi** — On-chain wallet risk monitoring on HashKey Chain
- ✅ **PayFi** — Foundation for automated payment risk assessment
- ✅ **ZKID** — ZKGate SDK integration ready for private identity

---

## 📄 License

MIT License — feel free to build on top of this project.

---

<div align="center">
  <strong>Powered by HashKey Chain · AI by DGrid</strong>
</div>