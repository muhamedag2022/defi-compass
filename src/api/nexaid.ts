export interface NexaIDAttestation {
  taskId: string
  address: string
  verified: boolean
  timestamp: number
  proof: string
  claims: {
    isHuman: boolean
    ageVerified: boolean
    notBlacklisted: boolean
    jurisdiction: string
  }
}

export type VerificationStatus = 'idle' | 'pending' | 'verified' | 'failed'

async function mockNexaIDVerification(address: string): Promise<NexaIDAttestation> {
  await new Promise(resolve => setTimeout(resolve, 2500))
  return {
    taskId: `task_${Date.now()}`,
    address,
    verified: true,
    timestamp: Date.now(),
    proof: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
    claims: {
      isHuman: true,
      ageVerified: true,
      notBlacklisted: true,
      jurisdiction: 'HK',
    },
  }
}

export async function verifyWithNexaID(address: string): Promise<NexaIDAttestation> {
  // TODO: Replace with real NexaID SDK when developer hub is available
  // const nexaIDNetwork = new NexaIDNetwork()
  // await nexaIDNetwork.init(window.ethereum, 133)
  // const task = await nexaIDNetwork.submitTask({ templateId: 'YOUR_TEMPLATE_ID', address })
  // const attestResult = await nexaIDNetwork.attest({ ...task, address, templateId: 'YOUR_TEMPLATE_ID' })
  // return attestResult
  return mockNexaIDVerification(address)
}