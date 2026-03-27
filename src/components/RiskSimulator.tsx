import { useState } from 'react'
import type { WalletData } from '../api/scan'
import type { RiskAnalysis } from '../api/ai'

interface Props {
  wallet: WalletData
  analysis: RiskAnalysis
}

interface SimResult {
  scenario: string
  newBalance: string
  impact: string
  newRiskScore: number
  newRiskLevel: 'Low' | 'Medium' | 'High'
  recommendation: string
}

const scenarios = [
  { id: 'drop20', label: 'HSK drops 20%', icon: '📉', factor: 0.8 },
  { id: 'drop50', label: 'HSK drops 50%', icon: '💥', factor: 0.5 },
  { id: 'gain30', label: 'HSK gains 30%', icon: '📈', factor: 1.3 },
  { id: 'hack', label: 'Wallet drained 80%', icon: '🚨', factor: 0.2 },
]

function simulate(wallet: WalletData, analysis: RiskAnalysis, factor: number, label: string): SimResult {
  const currentBalance = parseFloat(wallet.hskBalance)
  const newBalance = currentBalance * factor
  const pctChange = ((factor - 1) * 100).toFixed(1)
  const loss = (currentBalance - newBalance).toFixed(4)

  let newRiskScore = analysis.risk_score
  let newRiskLevel: 'Low' | 'Medium' | 'High' = analysis.risk_level
  let recommendation = ''

  if (factor < 0.5) {
    newRiskScore = Math.min(95, analysis.risk_score + 40)
    newRiskLevel = 'High'
    recommendation = 'Critical: Immediately activate HSP settlement to protect remaining assets'
  } else if (factor < 0.8) {
    newRiskScore = Math.min(90, analysis.risk_score + 20)
    newRiskLevel = newRiskScore > 60 ? 'High' : 'Medium'
    recommendation = 'Consider partial liquidation via HSP to reduce exposure'
  } else if (factor > 1) {
    newRiskScore = Math.max(10, analysis.risk_score - 15)
    newRiskLevel = newRiskScore > 70 ? 'High' : newRiskScore > 40 ? 'Medium' : 'Low'
    recommendation = 'Good opportunity to diversify gains into other assets'
  } else {
    newRiskScore = Math.min(85, analysis.risk_score + 10)
    newRiskLevel = newRiskScore > 70 ? 'High' : 'Medium'
    recommendation = 'Monitor closely and prepare HSP settlement if drop continues'
  }

  return {
    scenario: label,
    newBalance: newBalance.toFixed(4),
    impact: factor < 1 ? `-${loss} HSK (${pctChange}%)` : `+${Math.abs(parseFloat(loss)).toFixed(4)} HSK (+${pctChange}%)`,
    newRiskScore,
    newRiskLevel,
    recommendation,
  }
}

const riskColor = { Low: '#4ade80', Medium: '#facc15', High: '#ef4444' }

export default function RiskSimulator({ wallet, analysis }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<SimResult | null>(null)
  const [show, setShow] = useState(false)

  const handleSimulate = (scenario: typeof scenarios[0]) => {
    setSelected(scenario.id)
    const r = simulate(wallet, analysis, scenario.factor, scenario.label)
    setResult(r)
  }

  if (parseFloat(wallet.hskBalance) === 0) return null

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '10px', color: '#818cf8',
          fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔮</span>
          <span>Risk Simulator — What If?</span>
        </span>
        <span>{show ? '▲' : '▼'}</span>
      </button>

      {show && (
        <div style={{
          marginTop: '8px', padding: '16px',
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '12px'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Select a scenario
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSimulate(s)}
                style={{
                  padding: '10px 8px',
                  background: selected === s.id ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${selected === s.id ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', color: '#e2e8f0',
                  fontSize: '12px', cursor: 'pointer', textAlign: 'center'
                }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                <div>{s.label}</div>
              </button>
            ))}
          </div>

          {result && (
            <div style={{
              padding: '14px', background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <p style={{ color: '#818cf8', fontSize: '12px', fontWeight: 600, margin: '0 0 10px' }}>
                Simulation: {result.scenario}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ padding: '10px', background: 'rgba(168,85,247,0.08)', borderRadius: '8px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px', margin: '0 0 4px' }}>New Balance</p>
                  <p style={{ color: '#a855f7', fontSize: '14px', fontWeight: 700, margin: 0 }}>
                    {result.newBalance} HSK
                  </p>
                </div>
                <div style={{ padding: '10px', background: 'rgba(168,85,247,0.08)', borderRadius: '8px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px', margin: '0 0 4px' }}>Impact</p>
                  <p style={{
                    color: result.impact.startsWith('-') ? '#ef4444' : '#4ade80',
                    fontSize: '13px', fontWeight: 700, margin: 0
                  }}>
                    {result.impact}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)',
                  borderRadius: '999px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    width: `${result.newRiskScore}%`,
                    background: riskColor[result.newRiskLevel],
                    transition: 'width 0.8s ease'
                  }} />
                </div>
                <span style={{
                  color: riskColor[result.newRiskLevel],
                  fontSize: '13px', fontWeight: 700, flexShrink: 0
                }}>
                  {result.newRiskScore}/100
                </span>
                <span style={{
                  color: riskColor[result.newRiskLevel],
                  fontSize: '11px', flexShrink: 0
                }}>
                  {result.newRiskLevel}
                </span>
              </div>

              <div style={{
                padding: '10px 12px',
                background: `${riskColor[result.newRiskLevel]}10`,
                border: `1px solid ${riskColor[result.newRiskLevel]}30`,
                borderRadius: '8px'
              }}>
                <p style={{ color: riskColor[result.newRiskLevel], fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                  💡 {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}