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
  anomalies: string[]
  action_plan: {
    immediate: string
    short_term: string
    long_term: string
  }
}

async function step1_analyzePortfolio(wallet: WalletData): Promise<string> {
  const client = getClient()
  const tokensList = wallet.tokens.length > 0
    ? wallet.tokens.map(t => `${t.symbol}: ${t.balance}`).join(', ')
    : 'No ERC-20 tokens'

  const response = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are a DeFi portfolio analyst. Analyze this HashKey Chain wallet:
Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Total Transactions: ${wallet.txCount}
Unique Contracts: ${wallet.uniqueContracts}
Total Value Moved: ${wallet.totalValueMoved} HSK
Tokens: ${tokensList}

Provide a brief portfolio composition analysis in 2-3 sentences. Focus on concentration risk and diversification.`
    }]
  })
  return response.choices[0].message.content ?? ''
}

async function step2_detectAnomalies(wallet: WalletData): Promise<string> {
  const client = getClient()
  const txsList = wallet.recentTxs.length > 0
    ? wallet.recentTxs.map(t =>
        `${t.method ?? 'transfer'} | ${t.value} HSK | status:${t.status}`
      ).join('\n')
    : 'No recent transactions'

  const response = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are a DeFi security expert. Detect anomalies in these transactions:
${txsList}

Total moved: ${wallet.totalValueMoved} HSK vs current balance: ${wallet.hskBalance} HSK
Unique contracts interacted: ${wallet.uniqueContracts}

List any suspicious patterns, anomalies, or red flags in 2-3 bullet points. If none, say "No anomalies detected".`
    }]
  })
  return response.choices[0].message.content ?? ''
}

async function step3_generateFinalReport(
  wallet: WalletData,
  portfolioAnalysis: string,
  anomalyReport: string
): Promise<RiskAnalysis> {
  const client = getClient()

  const response = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are a DeFi risk manager. Based on these analyses, generate a final risk report.

PORTFOLIO ANALYSIS:
${portfolioAnalysis}

ANOMALY REPORT:
${anomalyReport}

WALLET DATA:
Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Transactions: ${wallet.txCount}
Unique Contracts: ${wallet.uniqueContracts}
Total Value Moved: ${wallet.totalValueMoved} HSK

Respond ONLY with valid JSON:
{
  "risk_score": <0-100>,
  "risk_level": "<Low|Medium|High>",
  "explanation": "<3-4 sentences synthesizing both analyses>",
  "suggestions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
  "risk_factors": {
    "concentration": <0-100>,
    "activity": <0-100>,
    "exposure": <0-100>
  },
  "anomalies": ["<anomaly 1>", "<anomaly 2>"],
  "action_plan": {
    "immediate": "<what to do right now>",
    "short_term": "<what to do this week>",
    "long_term": "<what to do this month>"
  },
  "urgent_alert": <true|false>
}`
    }]
  })

  const text = response.choices[0].message.content ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as RiskAnalysis
}

export async function analyzeWallet(
  wallet: WalletData,
  onStep?: (step: number, label: string) => void
): Promise<RiskAnalysis> {
  onStep?.(1, 'Analyzing portfolio composition...')
  const portfolioAnalysis = await step1_analyzePortfolio(wallet)

  onStep?.(2, 'Detecting anomalies and patterns...')
  const anomalyReport = await step2_detectAnomalies(wallet)

  onStep?.(3, 'Generating final risk report...')
  const finalReport = await step3_generateFinalReport(wallet, portfolioAnalysis, anomalyReport)

  return finalReport
}