import React, { useEffect, useState } from 'react'
import ListingCard from './ListingCard'
import { getContract } from '../lib/eth'

export default function ListingGrid({ account }) {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchListings() {
    setLoading(true)
    try {
      const { BrowserProvider } = await import('ethers')
      const provider = new BrowserProvider(window.ethereum)
      const c = await getContract(provider)

      const n = await c.funkoCount()
      const max = Number(n)
      const acc = []
      // Leggiamo direttamente il mapping pubblico `funkos(id)`
      for (let id = 1; id <= max; id++) {
        try {
          const F = await c.funkos(id)
          if (F && F.id && Number(F.id) > 0) acc.push(F)
        } catch {}
      }
      setItems(acc)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  async function handleBuy(id, priceWei) {
    try {
      const { BrowserProvider } = await import('ethers')
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const c = await getContract(signer)
      const tx = await c.buyFunkoPop(id, { value: priceWei })
      await tx.wait()
      await fetchListings()
      alert('Acquisto effettuato!')
    } catch (e) { alert(e.message) }
  }

  if (loading) return <p>Caricamento annunci…</p>
  if (!items.length) return <p>Nessun Funko in vendita.</p>

  return (
    <div className="grid">
      {items.map(F => (
        <ListingCard key={String(F.id)} F={F} me={account} onBuy={handleBuy} />
      ))}
    </div>
  )
}
