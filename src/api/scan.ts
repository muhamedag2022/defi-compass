import { createPublicClient, http, formatUnits } from 'viem'
import { hashkeyMainnet } from '../config/chains'

export const publicClient = createPublicClient({
  chain: hashkeyMainnet,
  transport: http('https://mainnet.hsk.xyz'),
})

const EXPLORER_API = 'https://hashkey.blockscout.com/api/v2'

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
}

export interface RecentTx {
  hash: string
  method: string
  value: string
  status: string
  timestamp: string
  to: string
  from: string
}

export interface WalletData {
  address: string
  hskBalance: string
  txCount: number
  tokens: TokenBalance[]
  recentTxs: RecentTx[]
  uniqueContracts: number
  totalValueMoved: string
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

    const [tokensRes, txsRes] = await Promise.all([
      fetch(`${EXPLORER_API}/addresses/${address}/tokens?type=ERC-20`),
      fetch(`${EXPLORER_API}/addresses/${address}/transactions`),
    ])

    const tokensData = await tokensRes.json()
    const txsData = await txsRes.json()

    const tokens: TokenBalance[] = (tokensData.items ?? []).map((item: any) => ({
      symbol: item.token?.symbol ?? 'UNKNOWN',
      name: item.token?.name ?? 'Unknown Token',
      balance: parseFloat(formatUnits(
        BigInt(item.value ?? '0'),
        item.token?.decimals ?? 18
      )).toFixed(4),
      decimals: item.token?.decimals ?? 18,
    }))

    const recentTxs: RecentTx[] = (txsData.items ?? []).slice(0, 10).map((tx: any) => ({
      hash: tx.hash,
      method: tx.method ?? tx.decoded_input?.method_call ?? 'transfer',
      value: parseFloat(formatUnits(BigInt(tx.value ?? '0'), 18)).toFixed(4),
      status: tx.status ?? 'ok',
      timestamp: tx.timestamp ?? '',
      to: tx.to?.hash ?? '',
      from: tx.from?.hash ?? '',
    }))

    const uniqueContracts = new Set(
      recentTxs
        .filter(tx => tx.to && tx.to !== address.toLowerCase())
        .map(tx => tx.to)
    ).size

    const totalValueMoved = recentTxs
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0)
      .toFixed(4)

    return {
      address,
      hskBalance,
      txCount,
      tokens,
      recentTxs,
      uniqueContracts,
      totalValueMoved,
    }

  } catch (err) {
    return {
      address,
      hskBalance: '0',
      txCount: 0,
      tokens: [],
      recentTxs: [],
      uniqueContracts: 0,
      totalValueMoved: '0',
      error: 'Failed to fetch wallet data. Check the address and try again.',
    }
  }
}