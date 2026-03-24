import OpenAI from 'openai'
import type { WalletData } from './scan'

function getClient() {
  return new OpenAI({
    baseURL: 'https://api.dgrid.ai/v1',
    apiKey: import.meta.env.VITE_DGRID_API_KEY,
    dangerouslyAllowBrowser: true,
  })
}

export interface RiskAnalysis {
  risk_score: number
  risk_level: 'Low' | 'Medium' | 'High'
  explanation: string
  suggestions: string[]
  risk_factors: {
    concentration: number
    activity: number
    exposure: number
  }
  urgent_alert: boolean
}

export async function analyzeWallet(wallet: WalletData): Promise<RiskAnalysis> {
  const tokensList = wallet.tokens.length > 0
    ? wallet.tokens.map(t => `${t.symbol}: ${t.balance}`).join(', ')
    : 'No ERC-20 tokens found'

  const txsList = wallet.recentTxs.length > 0
    ? wallet.recentTxs.map(t =>
        `${t.method ?? 'transfer'} | ${t.value} HSK | ${t.status}`
      ).join('\n')
    : 'No recent transactions'

  const prompt = `You are an expert DeFi risk analyst on HashKey Chain.
Analyze this wallet comprehensively and respond ONLY with valid JSON, no extra text:

=== WALLET DATA ===
Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Total Transactions: ${wallet.txCount}
Unique Contracts Interacted: ${wallet.uniqueContracts}
Total Value Moved (recent): ${wallet.totalValueMoved} HSK

=== TOKEN HOLDINGS ===
${tokensList}

=== RECENT TRANSACTIONS (last 10) ===
${txsList}

=== RISK FACTORS TO ANALYZE ===
1. Portfolio concentration (is most value in one asset?)
2. Transaction patterns (suspicious activity, large transfers)
3. Contract exposure (how many different contracts?)
4. Wallet activity level (dormant vs active)
5. Token diversification
6. Value at risk based on holdings

Respond with this exact JSON:
{
  "risk_score": <0-100>,
  "risk_level": "<Low|Medium|High>",
  "explanation": "<3-4 sentences analyzing the specific data above>",
  "suggestions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
  "risk_factors": {
    "concentration": <0-100>,
    "activity": <0-100>,
    "exposure": <0-100>
  },
  "urgent_alert": <true|false>
}`

  const response = await getClient().chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.choices[0].message.content ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as RiskAnalysis
}