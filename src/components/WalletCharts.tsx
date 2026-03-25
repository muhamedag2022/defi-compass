import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import type { WalletData } from '../api/scan'

interface Props {
  wallet: WalletData
}

const COLORS = ['#a855f7', '#7c3aed', '#4ade80', '#facc15', '#ef4444', '#60a5fa']

export default function WalletCharts({ wallet }: Props) {

  const portfolioData = [
    { name: 'HSK', value: parseFloat(wallet.hskBalance) || 0 },
    ...wallet.tokens.map(t => ({
      name: t.symbol,
      value: parseFloat(t.balance) || 0
    }))
  ].filter(d => d.value > 0)

  const methodCounts: Record<string, number> = {}
  wallet.recentTxs.forEach(tx => {
    const method = tx.method?.slice(0, 15) ?? 'transfer'
    methodCounts[method] = (methodCounts[method] || 0) + 1
  })

  const txData = Object.entries(methodCounts).map(([name, count]) => ({
    name,
    count,
  }))

  if (portfolioData.length === 0 && txData.length === 0) return null

  return (
    <div style={{ marginTop: '16px' }}>

      {/* Portfolio Distribution */}
      {portfolioData.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            color: '#9ca3af', fontSize: '11px', margin: '0 0 12px',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            Portfolio Distribution
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%" cy="50%"
                  innerRadius={35} outerRadius={55}
                  dataKey="value" strokeWidth={0}
                >
                  {portfolioData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1d27', border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: '8px', fontSize: '12px', color: '#e2e8f0'
                  }}
                  formatter={(value) => [`${Number(value).toFixed(2)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              {portfolioData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: COLORS[i % COLORS.length], flexShrink: 0
                  }} />
                  <span style={{ color: '#9ca3af', fontSize: '12px', flex: 1 }}>{item.name}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 500 }}>
                    {item.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Activity */}
      {txData.length > 0 && (
        <div>
          <p style={{
            color: '#9ca3af', fontSize: '11px', margin: '0 0 12px',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            Transaction Activity
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={txData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 9 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={false} tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1d27', border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '8px', fontSize: '12px', color: '#e2e8f0'
                }}
                formatter={(value) => [`${value} txs`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}