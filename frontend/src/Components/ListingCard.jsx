import React, { useEffect, useState } from "react";
import { formatEther } from "../lib/eth";
import { toHttpFromIpfs } from "../lib/ipfs";

export default function ListingCard({
  F,
  me,
  onBuy,
  onBid,
  onFinalizeAuction,
  onConfirmReceived,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  const isSeller = me && F.seller?.toLowerCase() === me.toLowerCase();
  const isBuyer = me && F.buyer?.toLowerCase() === me.toLowerCase();
  const img =
    toHttpFromIpfs(F.image) || "https://placehold.co/600x400?text=Funko";
  const isAuction = F.isAuction;
  const isSold = F.sold;
  const isFinalized = F.finalized;

  const auctionEnd = Number(F.auctionEndTime);

  useEffect(() => {
    if (!isAuction || !auctionEnd) return;

    function updateCountdown() {
      const now = Math.floor(Date.now() / 1000);
      let diff = auctionEnd - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const h = Math.floor(diff / 3600)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const s = Math.floor(diff % 60)
        .toString()
        .padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auctionEnd, isAuction]);

  const auctionExpired = isAuction && timeLeft === "00:00:00";

  return (
    <div className="card">
      {/* IMMAGINE */}
      <img
        src={img}
        alt={F.nameFunko}
        style={{
          width: "100%",
          borderRadius: 12,
          aspectRatio: "4/3",
          objectFit: "cover",
        }}
      />

      {/* TITOLO */}
      <h3 style={{ marginBottom: 6 }}>{F.nameFunko}</h3>

      {/* DESCRIZIONE */}
      <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{F.description}</p>

      {/* SEZIONE PREZZI / ASTA */}
      {!isAuction ? (
        // ============================
        //        VENDITA DIRETTA
        // ============================
        <div className="row" style={{ justifyContent: "space-between" }}>
          <strong>{formatEther(F.price)} ETH</strong>
          {isSold ? (
            <span className="badge">VENDUTO</span>
          ) : (
            <span className="badge">NUOVO</span>
          )}
        </div>
      ) : (
        // ============================
        //        ASTA
        // ============================
        <>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>Offerta attuale:</strong>
            <strong>{formatEther(F.highestBid)} ETH</strong>
          </div>

          <div className="row" style={{ marginTop: 4 }}>
            {!auctionExpired ? (
              <span className="badge green">Termina in {timeLeft}</span>
            ) : (
              <span className="badge red">Asta terminata</span>
            )}
          </div>
        </>
      )}

      {/* BOTTONI */}
      <div
        className="row"
        style={{ marginTop: 10, flexDirection: "column", gap: "8px" }}
      >
        {/* ---------------- VENDITA DIRETTA ---------------- */}
        {!isAuction && (
          <>
            {!isSold && !isSeller && (
              <button className="btn" onClick={() => onBuy(F.id, F.price)}>
                Compra
              </button>
            )}

            {isSeller && <span className="badge">Sei il venditore</span>}
            {isBuyer && (
              <span className="badge">Hai acquistato questo articolo</span>
            )}

            {isBuyer && !F.confirmed && (
              <button className="btn" onClick={() => onConfirmReceived(F.id)}>
                Conferma di aver ricevuto
              </button>
            )}
          </>
        )}

        {/* --------------------- ASTA --------------------- */}
        {isAuction && (
          <>
            {/* ASTA IN CORSO */}
            {!auctionExpired && !isFinalized && (
              <>
                {!isSeller && (
                  <button
                    className="btn"
                    onClick={() => {
                      const value = prompt("Inserisci la tua offerta in ETH:");
                      if (value) onBid(F.id, value);
                    }}
                  >
                    Fai un'Offerta
                  </button>
                )}

                {isSeller && <span className="badge">Asta in corso</span>}
              </>
            )}

            {/* ASTA TERMINATA MA NON FINALIZZATA */}
            {auctionExpired && !isFinalized && (
              <>
                {isSeller && (
                  <button
                    className="btn"
                    onClick={() => onFinalizeAuction(F.id)}
                  >
                    Finalizza Asta
                  </button>
                )}
                {!isSeller && (
                  <span className="badge">In attesa finalizzazione</span>
                )}
              </>
            )}

            {/* FINALIZZATA - ACQUIRENTE PUÒ CONFERMARE */}
            {isFinalized && isBuyer && !F.confirmed && (
              <button className="btn" onClick={() => onConfirmReceived(F.id)}>
                Conferma di aver ricevuto
              </button>
            )}

            {isFinalized && isBuyer && F.confirmed && (
              <span className="badge">Transazione completata</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
