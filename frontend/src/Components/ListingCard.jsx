import React, { useEffect, useState } from "react";
import { formatEther } from "../lib/eth";
import { toHttpFromIpfs } from "../lib/ipfs";
import styles from "../styles/ListingCard.module.css";

export default function ListingCard({
  F,
  me,
  onBuy,
  onBid,
  onFinalizeAuction,
  onConfirmReceived,
  onDelete,
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
    <div className={styles.card}>
      <div className={styles.content}>
        {/* IMMAGINE */}
        <img src={img} alt={F.nameFunko} className={styles.img} />

        {/* TITOLO */}
        <h3 className={styles.h3}>{F.nameFunko}</h3>

        {/* DESCRIZIONE */}
        <p className={styles.p}>{F.description}</p>

        {/* SEZIONE PREZZI / ASTA */}
        {!isAuction ? (
          // ============================
          //        VENDITA DIRETTA
          // ============================
          <div className={styles.infoRow}>
            <strong className={styles.price}>{formatEther(F.price)} ETH</strong>
            {isSold ? (
              <span className={styles.badge}>VENDUTO</span>
            ) : (
              <span className={styles.badge}>NUOVO</span>
            )}
          </div>
        ) : (
          // ============================
          //        ASTA
          // ============================
          <>
            <div className={styles.row}>
              <strong>Offerta attuale:</strong>
              <strong className={styles.price}>
                {formatEther(F.highestBid)} ETH
              </strong>
            </div>

            <div className={styles.row}>
              {!auctionExpired ? (
                <span className={styles.active}>Termina in {timeLeft}</span>
              ) : (
                <span className={styles.terminated}>Asta terminata</span>
              )}
            </div>
          </>
        )}

        {/* BOTTONI */}
        <div className={styles.row}>
          {/* ---------------- VENDITA DIRETTA ---------------- */}
          {!isAuction && (
            <>
              {!isSold && !isSeller && (
                <button
                  className={styles.compra}
                  onClick={() => onBuy(F.id, F.price)}
                >
                  Compra
                </button>
              )}
              <div className={styles.ownerContainer}>
                {isSeller && (
                  <span className={styles.owner}>Sei il venditore</span>
                )}
                {isSeller && !isSold && (
                  <button
                    className={styles.btn}
                    onClick={() => {
                      if (
                        confirm(
                          "Sei sicuro di voler eliminare questo annuncio? Questa operazione non è reversibile."
                        )
                      ) {
                        onDelete?.(F.id);
                      }
                    }}
                  >
                    Elimina annuncio
                  </button>
                )}
              </div>
              {isBuyer && (
                <>
                  <span className={styles["badge-center"]}>
                    Hai acquistato questo articolo
                  </span>
                  {isBuyer && !F.confirmed && (
                    <button
                      className={styles.btn}
                      onClick={() => onConfirmReceived(F.id)}
                    >
                      Conferma di aver ricevuto
                    </button>
                  )}
                </>
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
                      className={styles.btn}
                      onClick={() => {
                        const value = prompt(
                          "Inserisci la tua offerta in ETH:"
                        );
                        if (value) onBid(F.id, value);
                      }}
                    >
                      Fai un'Offerta
                    </button>
                  )}

                  {isSeller && (
                    <span className={styles.badge}>Asta in corso</span>
                  )}
                </>
              )}

              {/* ASTA TERMINATA MA NON FINALIZZATA */}
              {auctionExpired && !isFinalized && (
                <>
                  {isSeller && (
                    <button
                      className={styles.btn}
                      onClick={() => onFinalizeAuction(F.id)}
                    >
                      Finalizza Asta
                    </button>
                  )}
                  {!isSeller && (
                    <span className={styles.badge}>
                      In attesa finalizzazione
                    </span>
                  )}
                </>
              )}

              {/* FINALIZZATA - ACQUIRENTE PUÒ CONFERMARE */}
              {isFinalized && isBuyer && !F.confirmed && (
                <button
                  className={styles.btn}
                  onClick={() => onConfirmReceived(F.id)}
                >
                  Conferma di aver ricevuto
                </button>
              )}

              {isFinalized && isBuyer && F.confirmed && (
                <span className={styles.badge}>Transazione completata</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
