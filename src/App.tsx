import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { scanWallet } from './api/scan'
import type { WalletData } from './api/scan'
import { analyzeWallet } from './api/ai'
import type { RiskAnalysis } from './api/ai'
import { sendTelegramAlert } from './api/telegram'
import Logo from './components/Logo'

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
    subtitle: 'Your AI-powered risk advisor on HashKey Chain',
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
    footer: 'Powered by HashKey Chain · AI by DGrid',
    risk: 'Risk',
  },
  zh: {
    subtitle: '基于HashKey Chain的AI风险顾问',
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
    footer: '由HashKey Chain提供支持 · AI by DGrid',
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
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string>(localStorage.getItem('telegram_chat_id') ?? '')
  const [chatIdInput, setChatIdInput] = useState('')
  const [showAlertSetup, setShowAlertSetup] = useState(false)
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
    const result = await analyzeWallet(data)
    setAnalysis(result)
    if ((result.urgent_alert || result.risk_level === 'High') && chatId) {
      await sendTelegramAlert(addr, result.risk_score, result.risk_level, result.explanation, chatId)
    }
    setStep('idle')
    setLoading(false)
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
              {loading ? (step === 'scanning' ? tx.fetching : tx.analyzing) : tx.scanMy}
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
          {loading ? (step === 'scanning' ? tx.fetching : tx.analyzing) : tx.scan}
        </button>

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
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tx.walletData}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>{tx.balance}</span>
                <span style={{ fontWeight: 600, color: '#a855f7' }}>{wallet.hskBalance} HSK</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>{tx.txCount}</span>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{wallet.txCount}</span>
              </div>
            </div>
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
              </div>
            )}
          </div>
        )}
      </div>

      <p style={{ color: '#374151', fontSize: '12px', marginTop: '3rem' }}>
        {tx.footer}
      </p>
    </div>
  )
}

export default App