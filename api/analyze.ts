import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { wallet } = req.body
  if (!wallet) {
    return res.status(400).json({ error: 'Wallet data required' })
  }

  const client = new OpenAI({
    baseURL: 'https://api.dgrid.ai/v1',
    apiKey: process.env.VITE_DGRID_API_KEY,
  })

  try {
    const tokensList = wallet.tokens?.length > 0
      ? wallet.tokens.map((t: any) => `${t.symbol}: ${t.balance}`).join(', ')
      : 'No ERC-20 tokens'

    const txsList = wallet.recentTxs?.length > 0
      ? wallet.recentTxs.map((t: any) =>
          `${t.method ?? 'transfer'} | ${t.value} HSK | status:${t.status}`
        ).join('\n')
      : 'No recent transactions'

    const [portfolioRes, anomalyRes] = await Promise.all([
      client.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Analyze this HashKey Chain wallet portfolio in 2-3 sentences:
Address: ${wallet.address}
HSK Balance: ${wallet.hskBalance} HSK
Transactions: ${wallet.txCount}
Unique Contracts: ${wallet.uniqueContracts}
Tokens: ${tokensList}
Focus on concentration risk and diversification.`
        }]
      }),
      client.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Detect anomalies in these transactions (2-3 bullet points):
${txsList}
Total moved: ${wallet.totalValueMoved} HSK vs balance: ${wallet.hskBalance} HSK`
        }]
      })
    ])

    const portfolioAnalysis = portfolioRes.choices[0].message.content ?? ''
    const anomalyReport = anomalyRes.choices[0].message.content ?? ''

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
    const result = JSON.parse(clean)

    return res.status(200).json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return res.status(500).json({ error: 'Analysis failed' })
  }
}