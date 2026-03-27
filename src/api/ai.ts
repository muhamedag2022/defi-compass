import type { WalletData } from './scan'

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

async function analyzeViaBackend(wallet: WalletData): Promise<RiskAnalysis> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet }),
  })

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`)
  }

  return response.json()
}

async function analyzeViaDGrid(wallet: WalletData, onStep?: (step: number, label: string) => void): Promise<RiskAnalysis> {
  const { default: OpenAI } = await import('openai')

  const client = new OpenAI({
    baseURL: 'https://api.dgrid.ai/v1',
    apiKey: import.meta.env.VITE_DGRID_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  const tokensList = wallet.tokens.length > 0
    ? wallet.tokens.map(t => `${t.symbol}: ${t.balance}`).join(', ')
    : 'No ERC-20 tokens'

  const txsList = wallet.recentTxs.length > 0
    ? wallet.recentTxs.map(t =>
        `${t.method ?? 'transfer'} | ${t.value} HSK | status:${t.status}`
      ).join('\n')
    : 'No recent transactions'

  onStep?.(1, 'Analyzing portfolio composition...')
  const portfolioRes = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Analyze this HashKey Chain wallet in 2-3 sentences:
Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Transactions: ${wallet.txCount}
Unique Contracts: ${wallet.uniqueContracts}
Tokens: ${tokensList}
Focus on concentration risk and diversification.`
    }]
  })

  onStep?.(2, 'Detecting anomalies and patterns...')
  const anomalyRes = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Detect anomalies (2-3 bullet points):
${txsList}
Total moved: ${wallet.totalValueMoved} HSK vs balance: ${wallet.hskBalance} HSK`
    }]
  })

  const portfolioAnalysis = portfolioRes.choices[0].message.content ?? ''
  const anomalyReport = anomalyRes.choices[0].message.content ?? ''

  onStep?.(3, 'Generating final risk report...')
  const finalRes = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Generate final DeFi risk report. Respond ONLY with valid JSON:

PORTFOLIO: ${portfolioAnalysis}
ANOMALIES: ${anomalyReport}
WALLET: HSK=${wallet.hskBalance}, txCount=${wallet.txCount}, contracts=${wallet.uniqueContracts}

{
  "risk_score": <0-100>,
  "risk_level": "<Low|Medium|High>",
  "explanation": "<3-4 sentences>",
  "suggestions": ["<action 1>", "<action 2>", "<action 3>"],
  "risk_factors": { "concentration": <0-100>, "activity": <0-100>, "exposure": <0-100> },
  "anomalies": ["<anomaly 1>", "<anomaly 2>"],
  "action_plan": { "immediate": "<now>", "short_term": "<this week>", "long_term": "<this month>" },
  "urgent_alert": <true|false>
}`
    }]
  })

  const text = finalRes.choices[0].message.content ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as RiskAnalysis
}

export async function analyzeWallet(
  wallet: WalletData,
  onStep?: (step: number, label: string) => void
): Promise<RiskAnalysis> {
  try {
    onStep?.(1, 'Analyzing portfolio composition...')
    const result = await analyzeViaBackend(wallet)
    onStep?.(3, 'Analysis complete')
    return result
  } catch {
    console.log('Backend unavailable, using direct API...')
    return analyzeViaDGrid(wallet, onStep)
  }
}