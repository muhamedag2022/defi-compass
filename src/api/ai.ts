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
  urgent_alert: boolean
}

export async function analyzeWallet(wallet: WalletData): Promise<RiskAnalysis> {
  const prompt = `You are a DeFi risk expert on HashKey Chain.
Analyze this wallet data and respond ONLY with a valid JSON object, no extra text:

Wallet Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Total Transactions: ${wallet.txCount}

Respond with this exact JSON structure:
{
  "risk_score": <number 0-100>,
  "risk_level": "<Low|Medium|High>",
  "explanation": "<2-3 sentences explaining the risk in simple English>",
  "suggestions": ["<action 1>", "<action 2>", "<action 3>"],
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