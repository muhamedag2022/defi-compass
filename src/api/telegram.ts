const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN

export async function sendTelegramAlert(
  address: string,
  riskScore: number,
  riskLevel: string,
  explanation: string,
  chatId: string
): Promise<void> {
  const message = `
🚨 *DeFi Compass Alert*

*Risk Level:* ${riskLevel} (${riskScore}/100)
*Address:* \`${address.slice(0, 10)}...${address.slice(-6)}\`

*Analysis:*
${explanation}

⚡ Powered by HashKey Chain · AI by DGrid
  `.trim()

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  })
}