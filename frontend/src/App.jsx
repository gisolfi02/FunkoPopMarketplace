import React, { useState } from 'react'
import ConnectButton from './Components/ConnectButton'
import SellForm from './Components/SellForm'
import ListingGrid from './Components/ListingGrid'
import Orders from './Components/Orders'

export default function App() {
  const [session, setSession] = useState(null) // { provider, signer, account, chainId }

  return (
    <div className="container">
      <header className="row" style={{justifyContent:'space-between', marginBottom:16}}>
        <h2>Funko Pop Marketplace</h2>
        <ConnectButton onConnected={setSession} />
      </header>

      <div className="row" style={{alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <SellForm onCreated={() => window.location.reload()} />
        </div>
      </div>

      <h3 style={{marginTop:24}}>Annunci in vendita</h3>
      <ListingGrid account={session?.account} />

      <h3 style={{marginTop:24}}>Storico ordini</h3>
      <Orders account={session?.account} />
  
    </div>
  )
}
