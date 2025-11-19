import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers'
import { ABI, CONTRACT_ADDRESS } from './contract'

export async function getProviderAndSigner() {
  if (!window.ethereum) throw new Error('MetaMask non installato')
  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return { provider, signer }
}

export async function getContract(signerOrProvider) {
  return new Contract(CONTRACT_ADDRESS, ABI, signerOrProvider)
}

export async function networkOk(provider) {
  return provider.getNetwork(); 
}

export { formatEther, parseEther }
