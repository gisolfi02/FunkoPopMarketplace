import React, { useEffect, useState } from 'react'
import { BrowserProvider, Interface } from 'ethers'
import { ABI } from '../lib/contract'

export default function Orders({ account }) {
  const [events, setEvents] = useState([])

  useEffect(() => { (async () => {
    if (!window.ethereum) return
    const provider = new BrowserProvider(window.ethereum)
    const iface = new Interface(ABI)
    const latest = await provider.getBlockNumber()
    const fromBlock = Math.max(0, latest - 50000)

    async function fetch(evt) {
      const topic0 = iface.getEvent(evt).topicHash
      const logs = await provider.getLogs({ fromBlock, toBlock: 'latest', topics: [topic0] })
      return logs.map(l => ({ ...l, parsed: iface.parseLog(l) })).map(l => ({
        evt,
        id: Number(l.parsed.args[0]),
        who: String(l.parsed.args[1] ?? l.parsed.args[3] ?? ''),
        price: l.parsed.args[2] ? l.parsed.args[2].toString() : null,
        tx: l.transactionHash
      }))
    }

    const added = await fetch('FunkoPopAdded')       // (id, name, price, seller)
    const bought = await fetch('FunkoPopPurchased')  // (id, buyer)
    setEvents([...added, ...bought].sort((a,b)=>a.id-b.id))
  })() }, [account])

  if (!events.length) return <p>Nessun evento recente.</p>

  return (
    <div className="card">
      <h3>Storico (ultimi blocchi)</h3>
      <ul>
        {events.map((e,i)=>(
          <li key={i} style={{margin:'8px 0'}}>
            <span className="badge">#{e.id}</span> <strong>{e.evt}</strong> — {e.who.slice(0,6)}…{e.who.slice(-4)}
            <div style={{opacity:0.6, fontSize:12}}>tx: {e.tx.slice(0,10)}…</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
