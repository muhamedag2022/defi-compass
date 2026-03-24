import { defineChain } from 'viem'

export const hashkeyMainnet = defineChain({
  id: 177,
  name: 'HashKey Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer',
      url: 'https://hashkey.blockscout.com',
    },
  },
})

export const hashkeyTestnet = defineChain({
  id: 133,
  name: 'HashKey Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer Testnet',
      url: 'https://testnet-explorer.hsk.xyz',
    },
  },
  testnet: true,
})