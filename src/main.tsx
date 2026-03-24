import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { hashkeyMainnet, hashkeyTestnet } from './config/chains'
import App from './App.tsx'
import './index.css'

const config = createConfig({
  chains: [hashkeyMainnet, hashkeyTestnet],
  transports: {
    [hashkeyMainnet.id]: http(),
    [hashkeyTestnet.id]: http(),
  },
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)