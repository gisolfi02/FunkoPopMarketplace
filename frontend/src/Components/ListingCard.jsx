import React from 'react'
import { formatEther } from '../lib/eth'
import { toHttpFromIpfs } from '../lib/ipfs';

export default function ListingCard({ F, me, onBuy }) {
  const isSeller = me && F.seller?.toLowerCase() === me.toLowerCase()
  const isOwner  = me && F.owner?.toLowerCase() === me.toLowerCase()
  const img = toHttpFromIpfs(F.image) || 'https://placehold.co/600x400?text=Funko'

  return (
    <div className="card">
      <img src={img} alt={F.nameFunko} style={{width:'100%', borderRadius:12, aspectRatio:'4/3', objectFit:'cover'}}/>
      <h3 style={{marginBottom:6}}>{F.nameFunko}</h3>
      <div className="row" style={{justifyContent:'space-between'}}>
        <strong>{formatEther(F.price)} ETH</strong>
        {F.sold ? <span className="badge">SOLD</span> : <span className="badge">NEW</span>}
      </div>

      <div className="row" style={{marginTop:10}}>
        {!F.sold && !isSeller && (
          <button className="btn" onClick={() => onBuy(F.id, F.price)}>Compra</button>
        )}
        {isSeller && <span className="badge">Sei il venditore</span>}
        {isOwner &&  <span className="badge">Ne sei il proprietario</span>}
      </div>
    </div>
  )
}
