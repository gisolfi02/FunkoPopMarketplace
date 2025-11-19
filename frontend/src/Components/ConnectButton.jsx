import React, { useEffect, useState } from 'react'
import { getProviderAndSigner, networkOk } from '../lib/eth'

export default function ConnectButton({ onConnected }) {
  const [account, setAccount] = useState(null)
  const [chain, setChain] = useState(null)

  async function connect() {
    try {
      const { provider, signer } = await getProviderAndSigner()
      const addr = await signer.getAddress()
      const net = await networkOk(provider)
      setAccount(addr)
      setChain(net?.chainId?.toString())
      onConnected({ provider, signer, account: addr, chainId: net.chainId })
    } catch (e) {
      alert(e.message)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload())
      window.ethereum.on('chainChanged', () => window.location.reload())
    }
  }, [])

  return (
    <div className="row">
      {account ? (
        <>
          <span className="badge">{account.slice(0,6)}…{account.slice(-4)}</span>
          <span className="badge">chain: {chain}</span>
        </>
      ) : (
        <button className="btn" onClick={connect}>Connetti MetaMask</button>
      )}
    </div>
  )
}
