import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { scanWallet } from './api/scan'
import type { WalletData } from './api/scan'
import { analyzeWallet } from './api/ai'
import type { RiskAnalysis } from './api/ai'
import { sendTelegramAlert } from './api/telegram'
import Logo from './components/Logo'
import WalletCharts from './components/WalletCharts'
import { verifyWithNexaID } from './api/nexaid'
import type { NexaIDAttestation, VerificationStatus } from './api/nexaid'
import HSPSettlement from './components/HSPSettlement'
import RiskSimulator from './components/RiskSimulator'

const wallets = [
  { name: 'OKX Wallet', icon: '🟡' },
  { name: 'MetaMask', icon: '🦊' },
  { name: 'TokenPocket', icon: '🔵' },
  { name: 'ImToken', icon: '🟢' },
]

const riskColor = {
  Low: '#4ade80',
  Medium: '#facc15',
  High: '#ef4444',
}

const t = {
  en: {
    subtitle: 'AI Risk Guardian for Autonomous DeFi & PayFi on HashKey Chain',
    connect: 'Connect your wallet to get started',
    or: 'or scan any address',
    scan: 'Scan Wallet',
    scanMy: 'Scan My Wallet',
    disconnect: 'Disconnect',
    fetching: 'Fetching data...',
    analyzing: 'AI analyzing...',
    placeholder: 'Enter any wallet address: 0x...',
    walletData: 'Wallet Data',
    balance: 'HSK Balance',
    txCount: 'Transactions',
    recommendations: 'Recommendations',
    urgent: 'Urgent action required — high risk detected',
    alertSetup: 'Set up Telegram alerts for high risk notifications',
    setupBtn: 'Set up alerts',
    alertActive: 'Telegram alerts active',
    remove: 'Remove',
    save: 'Save',
    chatPlaceholder: 'Your Telegram chat ID...',
    connected: 'Connected on HashKey Chain',
    footer: 'Powered by HashKey Chain · AI by DGrid · NexaID ZKID · HSP PayFi',
    risk: 'Risk',
  },
  zh: {
    subtitle: '基于HashKey Chain的AI自主风险守护者',
    connect: '连接钱包开始使用',
    or: '或输入任意地址',
    scan: '扫描钱包',
    scanMy: '扫描我的钱包',
    disconnect: '断开连接',
    fetching: '获取数据中...',
    analyzing: 'AI分析中...',
    placeholder: '输入钱包地址: 0x...',
    walletData: '钱包数据',
    balance: 'HSK余额',
    txCount: '交易次数',
    recommendations: '建议',
    urgent: '紧急操作 — 检测到高风险',
    alertSetup: '设置Telegram高风险提醒',
    setupBtn: '设置提醒',
    alertActive: 'Telegram提醒已激活',
    remove: '移除',
    save: '保存',
    chatPlaceholder: '你的Telegram Chat ID...',
    connected: '已连接到HashKey Chain',
    footer: '由HashKey Chain提供支持 · AI by DGrid · NexaID ZKID · HSP PayFi',
    risk: '风险',
  },
}

function App() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [scanAddress, setScanAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'idle' | 'scanning' | 'analyzing'>('idle')
  const [agentStep, setAgentStep] = useState(0)
  const [agentLabel, setAgentLabel] = useState('')
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string>(localStorage.getItem('telegram_chat_id') ?? '')
  const [chatIdInput, setChatIdInput] = useState('')
  const [showAlertSetup, setShowAlertSetup] = useState(false)
  const [nexaStatus, setNexaStatus] = useState<VerificationStatus>('idle')
  const [nexaAttestation, setNexaAttestation] = useState<NexaIDAttestation | null>(null)
  const [lang, setLang] = useState<'en' | 'zh'>('en')
  

  const tx = t[lang]

  const handleScan = async (addr: string) => {
    if (!addr) return
    setError(null)
    setWallet(null)
    setAnalysis(null)
    setStep('scanning')
    setLoading(true)
    const data = await scanWallet(addr)
    if (data.error) {
      setError(data.error)
      setLoading(false)
      setStep('idle')
      return
    }
    setWallet(data)
    setStep('analyzing')
    const result = await analyzeWallet(data, (step, label) => {
    setAgentStep(step)
    setAgentLabel(label)
           })
    setAnalysis(result)
    if ((result.urgent_alert || result.risk_level === 'High') && chatId) {
      await sendTelegramAlert(addr, result.risk_score, result.risk_level, result.explanation, chatId)
    }
    setStep('idle')
    setLoading(false)
  }
  const handleNexaVerify = async () => {
  const addr = address || scanAddress
  if (!addr) return
  setNexaStatus('pending')
  try {
    const attestation = await verifyWithNexaID(addr)
    setNexaAttestation(attestation)
    setNexaStatus('verified')
  } catch {
    setNexaStatus('failed')
  }
}

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0a1a 50%, #0a0f1a 100%)',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      position: 'relative',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Language toggle */}
      <div style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        display: 'flex', gap: '4px',
        background: '#1a1d27', borderRadius: '8px', padding: '3px'
      }}>
        {(['en', 'zh'] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)}
            style={{
              padding: '5px 12px', borderRadius: '6px', border: 'none',
              background: lang === l ? '#7c3aed' : 'transparent',
              color: lang === l ? '#fff' : '#888',
              fontSize: '12px', cursor: 'pointer', fontWeight: 500
            }}>
            {l === 'en' ? 'EN' : '中文'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <Logo />
        </div>
        <h1 style={{
          fontSize: '2.2rem', margin: '0 0 0.4rem',
          background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          lineHeight: '1.3'
        }}>
          DeFi Compass
        </h1>
        <p style={{ color: '#9ca3af', margin: '0.5rem 0 0', fontSize: '14px' }}>{tx.subtitle}</p>
      </div>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>

        {!isConnected ? (
          <>
            <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginBottom: '1rem' }}>
              {tx.connect}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {wallets.map((w) => (
                <button key={w.name} onClick={() => connect({ connector: injected() })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff', border: '1px solid rgba(168,85,247,0.2)',
                    borderRadius: '12px', padding: '13px 18px',
                    fontSize: '15px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#a855f7'
                    e.currentTarget.style.background = 'rgba(168,85,247,0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }}>
                  <span style={{ fontSize: '20px' }}>{w.icon}</span>
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.2)' }} />
              <span style={{ color: '#555', fontSize: '13px' }}>{tx.or}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.2)' }} />
            </div>
          </>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: '12px', padding: '16px', marginBottom: '1.5rem', textAlign: 'center'
          }}>
            <p style={{ color: '#4ade80', margin: '0 0 4px', fontSize: '13px' }}>{tx.connected}</p>
            <p style={{ margin: '0 0 12px', fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0' }}>
              {address?.slice(0, 10)}...{address?.slice(-6)}
            </p>
            <button onClick={() => handleScan(address!)} disabled={loading}
              style={{
                width: '100%', background: loading ? '#4a2a8a' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '12px', fontSize: '15px', cursor: 'pointer', marginBottom: '8px'
              }}>
              {loading
  ? step === 'scanning'
    ? tx.fetching
    : agentLabel || tx.analyzing
  : tx.scanMy}
            </button>
            <button onClick={() => disconnect()}
              style={{
                width: '100%', background: 'transparent', color: '#666',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                padding: '9px', fontSize: '13px', cursor: 'pointer'
              }}>
              {tx.disconnect}
            </button>
          </div>
        )}

        <input type="text" placeholder={tx.placeholder}
          value={scanAddress} onChange={(e) => setScanAddress(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px',
            border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(255,255,255,0.03)',
            color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none'
          }}
        />
        <button onClick={() => handleScan(scanAddress)} disabled={loading || !scanAddress}
          style={{
            marginTop: '10px', width: '100%',
            background: loading || !scanAddress ? '#2d1f4a' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: loading || !scanAddress ? '#666' : '#fff',
            border: 'none', borderRadius: '12px',
            padding: '13px', fontSize: '15px', cursor: 'pointer', fontWeight: 500
          }}>
          {loading
  ? step === 'scanning'
    ? tx.fetching
    : agentLabel || tx.analyzing
  : tx.scan}
        </button>
        {/* AI Agent Steps */}
{loading && step === 'analyzing' && (
  <div style={{
    marginTop: '10px', padding: '12px',
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.2)',
    borderRadius: '10px'
  }}>
    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      AI Agent — Multi-step Analysis
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {[
        { num: 1, label: 'Portfolio composition analysis' },
        { num: 2, label: 'Anomaly & pattern detection' },
        { num: 3, label: 'Final risk report generation' },
      ].map((s) => (
        <div key={s.num} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 10px', borderRadius: '8px',
          background: agentStep >= s.num ? 'rgba(168,85,247,0.1)' : 'transparent'
        }}>
          <span style={{
            width: '18px', height: '18px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, flexShrink: 0,
            background: agentStep > s.num ? '#4ade80' : agentStep === s.num ? '#a855f7' : 'rgba(255,255,255,0.1)',
            color: agentStep >= s.num ? '#fff' : '#555'
          }}>
            {agentStep > s.num ? '✓' : s.num}
          </span>
          <span style={{
            fontSize: '12px',
            color: agentStep > s.num ? '#4ade80' : agentStep === s.num ? '#a855f7' : '#555'
          }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
        {/* NexaID Verification */}
<div style={{ marginTop: '1rem' }}>
  {nexaStatus === 'idle' && (
    <button
      onClick={handleNexaVerify}
      disabled={!address && !scanAddress}
      style={{
        width: '100%', padding: '12px',
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '12px', color: '#10b981',
        fontSize: '13px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}>
      <span style={{ fontSize: '16px' }}>🔐</span>
      Verify Identity with NexaID (ZKID)
    </button>
  )}

  {nexaStatus === 'pending' && (
    <div style={{
      padding: '12px', background: 'rgba(16,185,129,0.05)',
      border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px',
      textAlign: 'center'
    }}>
      <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>
        Generating ZK proof... please wait
      </p>
    </div>
  )}

  {nexaStatus === 'verified' && nexaAttestation && (
    <div style={{
      padding: '14px', background: 'rgba(16,185,129,0.05)',
      border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '16px' }}>✅</span>
        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
          Identity Verified via NexaID
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { label: 'Human verification', value: nexaAttestation.claims.isHuman },
          { label: 'Age verified (18+)', value: nexaAttestation.claims.ageVerified },
          { label: 'Not blacklisted', value: nexaAttestation.claims.notBlacklisted },
        ].map((claim) => (
          <div key={claim.label} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{claim.label}</span>
            <span style={{ color: claim.value ? '#10b981' : '#ef4444', fontSize: '12px' }}>
              {claim.value ? '✓ Passed' : '✗ Failed'}
            </span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Jurisdiction</span>
          <span style={{ color: '#10b981', fontSize: '12px' }}>
            {nexaAttestation.claims.jurisdiction}
          </span>
        </div>
        <div style={{
          marginTop: '4px', padding: '6px 10px',
          background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>ZK Proof: </span>
          <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace' }}>
            {nexaAttestation.proof.slice(0, 20)}...
          </span>
        </div>
      </div>
      <button
        onClick={() => { setNexaStatus('idle'); setNexaAttestation(null) }}
        style={{
          marginTop: '10px', width: '100%', background: 'transparent',
          color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '6px', fontSize: '12px', cursor: 'pointer'
        }}>
        Reset verification
      </button>
    </div>
  )}

  {nexaStatus === 'failed' && (
    <div style={{
      padding: '12px', background: 'rgba(239,68,68,0.05)',
      border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
      textAlign: 'center'
    }}>
      <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 8px' }}>
        Verification failed. Please try again.
      </p>
      <button onClick={() => setNexaStatus('idle')}
        style={{
          background: 'transparent', color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
          padding: '6px 16px', fontSize: '12px', cursor: 'pointer'
        }}>
        Retry
      </button>
    </div>
  )}
</div>
        {/* Telegram Setup */}
        <div style={{ marginTop: '1rem' }}>
          {!chatId ? (
            <div style={{
              padding: '14px', background: 'rgba(59,130,246,0.05)',
              border: '1px dashed rgba(59,130,246,0.4)', borderRadius: '12px'
            }}>
              <p style={{ color: '#60a5fa', fontSize: '13px', margin: '0 0 10px' }}>{tx.alertSetup}</p>
              {!showAlertSetup ? (
                <button onClick={() => setShowAlertSetup(true)}
                  style={{
                    width: '100%', background: 'transparent', color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.4)', borderRadius: '8px',
                    padding: '9px', fontSize: '13px', cursor: 'pointer'
                  }}>
                  {tx.setupBtn}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" placeholder={tx.chatPlaceholder}
                    value={chatIdInput} onChange={(e) => setChatIdInput(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(255,255,255,0.03)',
                      color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none'
                    }}
                  />
                  <button onClick={() => {
                    if (chatIdInput) {
                      localStorage.setItem('telegram_chat_id', chatIdInput)
                      setChatId(chatIdInput)
                      setShowAlertSetup(false)
                      setChatIdInput('')
                    }
                  }}
                    style={{
                      width: '100%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      color: '#fff', border: 'none', borderRadius: '8px',
                      padding: '10px', fontSize: '13px', cursor: 'pointer'
                    }}>
                    {tx.save}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '10px 14px', background: 'rgba(74,222,128,0.05)',
              border: '1px solid rgba(74,222,128,0.2)', borderRadius: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ color: '#4ade80', fontSize: '13px' }}>{tx.alertActive}</span>
              <button onClick={() => { localStorage.removeItem('telegram_chat_id'); setChatId('') }}
                style={{
                  background: 'transparent', color: '#666',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                  padding: '4px 10px', fontSize: '12px', cursor: 'pointer'
                }}>
                {tx.remove}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '1rem', padding: '14px',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', color: '#ef4444', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {wallet && !error && (
  <div style={{
    marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '20px'
  }}>
    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {tx.walletData}
    </p>

    {/* Stats Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
      <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px' }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>{tx.balance}</p>
        <p style={{ color: '#a855f7', fontWeight: 700, fontSize: '16px', margin: 0 }}>{wallet.hskBalance} HSK</p>
      </div>
      <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px' }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>{tx.txCount}</p>
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '16px', margin: 0 }}>{wallet.txCount}</p>
      </div>
      <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px' }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>Unique Contracts</p>
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '16px', margin: 0 }}>{wallet.uniqueContracts}</p>
      </div>
      <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px' }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>Total Moved</p>
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '16px', margin: 0 }}>{wallet.totalValueMoved} HSK</p>
      </div>
    </div>

    {/* Tokens */}
    {wallet.tokens.length > 0 && (
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Tokens ({wallet.tokens.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {wallet.tokens.slice(0, 5).map((token, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
            }}>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{token.symbol}</span>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>{token.balance}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Recent Transactions */}
    {wallet.recentTxs.length > 0 && (
      <div>
        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent Transactions ({wallet.recentTxs.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {wallet.recentTxs.slice(0, 5).map((tx, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                  background: tx.status === 'ok' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                  color: tx.status === 'ok' ? '#4ade80' : '#ef4444'
                }}>
                  {tx.status === 'ok' ? '✓' : '✗'}
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '12px' }}>
                  {tx.method?.slice(0, 20) ?? 'transfer'}
                </span>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>{tx.value} HSK</span>
            </div>
          ))}
        </div>
      </div>
    )}
    {wallet && <WalletCharts wallet={wallet} />}
  </div>
)}

        {analysis && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${riskColor[analysis.risk_level]}40`,
            borderRadius: '12px', padding: '20px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                fontSize: '3.5rem', fontWeight: 800,
                color: riskColor[analysis.risk_level],
                lineHeight: 1
              }}>
                {analysis.risk_score}
              </div>
              <div style={{
                fontSize: '13px', fontWeight: 600, marginTop: '4px',
                color: riskColor[analysis.risk_level],
                textTransform: 'uppercase', letterSpacing: '0.1em'
              }}>
                {analysis.risk_level} {tx.risk}
              </div>
            </div>

            <p style={{
              fontSize: '14px', color: '#d1d5db', lineHeight: 1.7,
              margin: '0 0 16px', padding: '14px',
              background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {analysis.explanation}
            </p>
            {/* Risk Factors */}
{analysis.risk_factors && (
  <div style={{ marginBottom: '16px' }}>
    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      Risk Breakdown
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[
        { label: 'Concentration', value: analysis.risk_factors.concentration },
        { label: 'Activity', value: analysis.risk_factors.activity },
        { label: 'Exposure', value: analysis.risk_factors.exposure },
      ].map((factor) => (
        <div key={factor.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{factor.label}</span>
            <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 500 }}>{factor.value}/100</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${factor.value}%`,
              background: factor.value > 70 ? '#ef4444' : factor.value > 40 ? '#facc15' : '#4ade80',
              transition: 'width 0.8s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tx.recommendations}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analysis.suggestions.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '12px', background: 'rgba(168,85,247,0.05)',
                  borderRadius: '10px', border: '1px solid rgba(168,85,247,0.1)'
                }}>
                  <span style={{
                    color: '#a855f7', fontWeight: 700, flexShrink: 0,
                    width: '20px', height: '20px', background: 'rgba(168,85,247,0.15)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '12px'
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>

            {analysis.urgent_alert && (
              <div style={{
                marginTop: '14px', padding: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', color: '#ef4444', fontSize: '13px', textAlign: 'center'
              }}>
                ⚠ {tx.urgent}
                {/* Action Plan */}
{analysis.action_plan && (
  <div style={{ marginTop: '14px' }}>
    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      Action Plan
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[
        { label: 'Immediate', value: analysis.action_plan.immediate, color: '#ef4444' },
        { label: 'This week', value: analysis.action_plan.short_term, color: '#facc15' },
        { label: 'This month', value: analysis.action_plan.long_term, color: '#4ade80' },
      ].map((item) => (
        <div key={item.label} style={{
          padding: '10px 12px', background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px', borderLeft: `3px solid ${item.color}`
        }}>
          <p style={{ color: item.color, fontSize: '11px', margin: '0 0 4px', fontWeight: 600 }}>
            {item.label}
          </p>
          <p style={{ color: '#d1d5db', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{/* Anomalies */}
{analysis.anomalies && analysis.anomalies.length > 0 && analysis.anomalies[0] !== 'No anomalies detected' && (
  <div style={{ marginTop: '14px' }}>
    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      Detected Anomalies
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {analysis.anomalies.map((anomaly, i) => (
        <div key={i} style={{
          display: 'flex', gap: '8px', padding: '8px 12px',
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px'
        }}>
          <span style={{ color: '#ef4444', flexShrink: 0 }}>⚠</span>
          <span style={{ color: '#d1d5db', fontSize: '12px', lineHeight: 1.5 }}>{anomaly}</span>
        </div>
      ))}
    </div>
  </div>
)}
              </div>
            )}
            {/* Risk Simulator */}
{wallet && analysis && (
  <RiskSimulator wallet={wallet} analysis={analysis} />
)}
            {/* HSP Settlement */}
{wallet && analysis && (
  <HSPSettlement
    wallet={wallet}
    analysis={analysis}
    nexaVerified={nexaStatus === 'verified'}
  />
)}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
  <p style={{ color: '#555', fontSize: '12px', marginBottom: '1rem' }}>
    {tx.footer}
  </p>
  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
    <a href="https://x.com/DeFiCompassHSK" target="_blank" rel="noopener noreferrer"
      style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
      onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
      X (Twitter)
    </a>
    <span style={{ color: '#333' }}>·</span>
    <a href="https://t.me/defi_compass_alert_bot" target="_blank" rel="noopener noreferrer"
      style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
      onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
      Telegram
    </a>
    <span style={{ color: '#333' }}>·</span>
    <a href="https://github.com/muhamedag2022/defi-compass" target="_blank" rel="noopener noreferrer"
      style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
      onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
      GitHub
    </a>
    <span style={{ color: '#333' }}>·</span>
    <a href="https://www.youtube.com/@mohamedasanhaji1334" target="_blank" rel="noopener noreferrer"
      style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
      onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
      Demo Video
    </a>
  </div>
</div>
    </div>
  )
}

export default App