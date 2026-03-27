export interface HSPPayoutDetail {
  detail_no: string
  target_type: 'CARD' | 'WALLET' | 'BANK'
  amount: string
  currency: 'HSK' | 'USDT' | 'USDC'
  description: string
}

export interface HSPSettlementPlan {
  batch_no: string
  total_amount: string
  currency: string
  payout_details: HSPPayoutDetail[]
  ai_reasoning: string
  estimated_fee: string
}

export interface HSPResult {
  success: boolean
  batch_no: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  message: string
  timestamp: number
}

export function generateSettlementPlan(
  hskBalance: string,
  riskScore: number,
  riskLevel: string
): HSPSettlementPlan {
  const balance = parseFloat(hskBalance)
  const batchNo = `DEFI-COMPASS-${Date.now()}`

  if (riskLevel === 'High' && balance > 0) {
    const safeAmount = (balance * 0.5).toFixed(4)
    const investAmount = (balance * 0.3).toFixed(4)
    const holdAmount = (balance * 0.2).toFixed(4)

    return {
      batch_no: batchNo,
      total_amount: balance.toFixed(4),
      currency: 'HSK',
      ai_reasoning: `High risk detected (score: ${riskScore}/100). AI recommends immediate rebalancing to protect your assets. 50% converted to stable spending balance, 30% reinvested in HSK ecosystem, 20% held as liquidity reserve.`,
      estimated_fee: (balance * 0.001).toFixed(4),
      payout_details: [
        {
          detail_no: 'D001',
          target_type: 'CARD',
          amount: safeAmount,
          currency: 'HSK',
          description: 'Convert to HashKey Card spending balance (risk mitigation)',
        },
        {
          detail_no: 'D002',
          target_type: 'WALLET',
          amount: investAmount,
          currency: 'HSK',
          description: 'Reinvest in HSK ecosystem',
        },
        {
          detail_no: 'D003',
          target_type: 'WALLET',
          amount: holdAmount,
          currency: 'HSK',
          description: 'Hold as liquidity reserve',
        },
      ],
    }
  }

  const conserveAmount = (balance * 0.7).toFixed(4)
  const growAmount = (balance * 0.3).toFixed(4)

  return {
    batch_no: batchNo,
    total_amount: balance.toFixed(4),
    currency: 'HSK',
    ai_reasoning: `Medium/Low risk detected (score: ${riskScore}/100). AI suggests optimized allocation to maximize yield while maintaining safety.`,
    estimated_fee: (balance * 0.001).toFixed(4),
    payout_details: [
      {
        detail_no: 'D001',
        target_type: 'WALLET',
        amount: conserveAmount,
        currency: 'HSK',
        description: 'Hold in secure wallet (70%)',
      },
      {
        detail_no: 'D002',
        target_type: 'CARD',
        amount: growAmount,
        currency: 'HSK',
        description: 'Convert to spending balance (30%)',
      },
    ],
  }
}

export async function executeHSPSettlement(plan: HSPSettlementPlan): Promise<HSPResult> {
  // TODO: Replace with real HSP API when credentials are available
  // const response = await fetch('https://api.hashkey.com/hsp/v1/payout/multi', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-App-ID': import.meta.env.VITE_HSP_APP_ID,
  //     'X-Api-Key': import.meta.env.VITE_HSP_API_KEY,
  //   },
  //   body: JSON.stringify(plan),
  // })
  // return response.json()

  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    success: true,
    batch_no: plan.batch_no,
    status: 'COMPLETED',
    message: 'Settlement executed successfully via HashKey HSP MultiPay',
    timestamp: Date.now(),
  }
}