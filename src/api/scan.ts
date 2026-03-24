import { createPublicClient, http, formatUnits } from 'viem'
import { hashkeyMainnet } from '../config/chains'

export const publicClient = createPublicClient({
  chain: hashkeyMainnet,
  transport: http('https://mainnet.hsk.xyz'),
})

export interface WalletData {
  address: string
  hskBalance: string
  txCount: number
  error?: string
}

export async function scanWallet(address: string): Promise<WalletData> {
  try {
    const addr = address as `0x${string}`

    const [balanceRaw, txCount] = await Promise.all([
      publicClient.getBalance({ address: addr }),
      publicClient.getTransactionCount({ address: addr }),
    ])

    const hskBalance = parseFloat(formatUnits(balanceRaw, 18)).toFixed(4)

    return {
      address,
      hskBalance,
      txCount,
    }

  } catch (err) {
    return {
      address,
      hskBalance: '0',
      txCount: 0,
      error: 'Failed to fetch wallet data. Check the address and try again.',
    }
  }
}