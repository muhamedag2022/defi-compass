import { useState } from 'react'
import { generateSettlementPlan, executeHSPSettlement } from '../api/hsp'
import type { HSPSettlementPlan, HSPResult } from '../api/hsp'
import type { RiskAnalysis } from '../api/ai'
import type { WalletData } from '../api/scan'

interface Props {
  wallet: WalletData
  analysis: RiskAnalysis
  nexaVerified: boolean
}

export default function HSPSettlement({ wallet, analysis, nexaVerified }: Props) {
  const [plan, setPlan] = useState<HSPSettlementPlan | null>(null)
  const [result, setResult] = useState<HSPResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'idle' | 'plan' | 'confirm' | 'done'>('idle')

  const handleGeneratePlan = () => {
    const p = generateSettlementPlan(wallet.hskBalance, analysis.risk_score, analysis.risk_level)
    setPlan(p)
    setStep('plan')
  }

  const handleExecute = async () => {
    if (!plan) return
    setLoading(true)
    setStep('confirm')
    const r = await executeHSPSettlement(plan)
    setResult(r)
    setStep('done')
    setLoading(false)
  }

  const targetColors: Record<string, string> = {
    CARD: '#f59e0b',
    WALLET: '#a855f7',
    BANK: '#3b82f6',
  }

  if (parseFloat(wallet.hskBalance) === 0) return null

  return (
    <div style={{ marginTop: '1rem' }}>

      {step === 'idle' && (
        <div style={{
          padding: '14px',
          background: 'rgba(245,158,11,0.05)',
          border: `1px solid ${analysis.risk_level === 'High' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.3)'}`,
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>💳</span>
            <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 600 }}>
              HashKey HSP — PayFi Settlement
            </span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 10px', lineHeight: 1.6 }}>
            {analysis.risk_level === 'High'
              ? 'High risk detected. AI recommends immediate asset rebalancing via HSP MultiPay.'
              : 'AI can optimize your asset allocation via HashKey Settlement Protocol (HSP).'}
          </p>
          {!nexaVerified && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: '0 0 8px' }}>
              ⚠ Verify your identity with NexaID first to enable HSP settlement
            </p>
          )}
          <button
            onClick={handleGeneratePlan}
            disabled={!nexaVerified}
            style={{
              width: '100%',
              background: nexaVerified ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
              color: nexaVerified ? '#f59e0b' : '#555',
              border: `1px solid ${nexaVerified ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px', padding: '10px',
              fontSize: '13px', cursor: nexaVerified ? 'pointer' : 'not-allowed'
            }}>
            {nexaVerified ? 'Generate AI Settlement Plan' : 'NexaID verification required'}
          </button>
        </div>
      )}

      {step === 'plan' && plan && (
        <div style={{
          padding: '16px', background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px'
        }}>
          <p style={{ color: '#f59e0b', fontSize: '11px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI Settlement Plan — HSP MultiPay
          </p>

          <div style={{
            padding: '10px 12px', background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px', marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <p style={{ color: '#d1d5db', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
              {plan.ai_reasoning}
            </p>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase' }}>
            Payout Routes
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {plan.payout_details.map((detail) => (
              <div key={detail.detail_no} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                    background: `${targetColors[detail.target_type]}20`,
                    color: targetColors[detail.target_type], fontWeight: 600
                  }}>
                    {detail.target_type}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>{detail.description}</span>
                </div>
                <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                  {detail.amount} {detail.currency}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 12px', background: 'rgba(245,158,11,0.08)',
            borderRadius: '8px', marginBottom: '12px'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Estimated fee</span>
            <span style={{ color: '#f59e0b', fontSize: '12px' }}>{plan.estimated_fee} HSK</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setStep('idle')}
              style={{
                flex: 1, background: 'transparent', color: '#666',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                padding: '10px', fontSize: '13px', cursor: 'pointer'
              }}>
              Cancel
            </button>
            <button
              onClick={handleExecute}
              style={{
                flex: 2, background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600
              }}>
              Confirm & Execute via HSP
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && loading && (
        <div style={{
          padding: '20px', background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#f59e0b', fontSize: '13px', margin: 0 }}>
            Executing settlement via HSP MultiPay...
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0' }}>
            Processing batch transaction on HashKey Chain
          </p>
        </div>
      )}

      {step === 'done' && result && (
        <div style={{
          padding: '16px',
          background: result.success ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
          border: `1px solid ${result.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px' }}>{result.success ? '✅' : '❌'}</span>
            <span style={{ color: result.success ? '#10b981' : '#ef4444', fontSize: '13px', fontWeight: 600 }}>
              {result.success ? 'Settlement Completed' : 'Settlement Failed'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Batch ID</span>
              <span style={{ color: '#e2e8f0', fontSize: '11px', fontFamily: 'monospace' }}>{result.batch_no.slice(0, 25)}...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Status</span>
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>{result.status}</span>
            </div>
            <div style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>{result.message}</span>
            </div>
          </div>
          <button
            onClick={() => { setStep('idle'); setPlan(null); setResult(null) }}
            style={{
              marginTop: '10px', width: '100%', background: 'transparent', color: '#6b7280',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '8px', fontSize: '12px', cursor: 'pointer'
            }}>
            New Settlement
          </button>
        </div>
      )}
    </div>
  )
}