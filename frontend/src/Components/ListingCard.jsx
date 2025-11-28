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

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [bidPopupVisible, setBidPopupVisible] = useState(false);
  const [bidValue, setBidValue] = useState("");

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
          <div className={styles.row}>
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
            <div className={styles.offerBox}>
              <div className={styles.offerLabel}> OFFERTA ATTUALE</div>
              <div className={styles.offerValue}>
                {formatEther(F.highestBid)} ETH
              </div>
            </div>

            <div className={styles.timeLeftBox}>
              {" "}
              {!auctionExpired ? (
                <>
                  <div className={styles.timeLabel}>TERMINA IN</div>
                  <div className={styles.timeValue}>{timeLeft}</div>
                </>
              ) : (
                <div className={styles.timeEnded}>Asta terminata</div>
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
                      setDeletePopupVisible(true);
                    }}
                  >
                    Elimina annuncio
                  </button>
                )}
              </div>
              {isBuyer && (
                <span className={styles.badge}>
                  Hai acquistato questo articolo
                </span>
              )}

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

          {/* --------------------- ASTA --------------------- */}
          {isAuction && (
            <>
              {/* ASTA IN CORSO */}
              {!auctionExpired && !isFinalized && (
                <>
                  {!isSeller && (
                    <button
                      className={styles.btn}
                      onClick={() => setBidPopupVisible(true)}
                    >
                      Fai un'Offerta
                    </button>
                  )}

                  {isSeller && (
                    <span className={styles.asta}>Asta in corso</span>
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
      {/* POPUP ELIMINA ANNUNCIO */}
      {deletePopupVisible && (
        <div className={styles.deletePopUp}>
          <h3>Sei sicuro di voler eliminare questo annuncio? </h3>
          <p>Questa operazione non è reversibile.</p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.btnConfirm}
              onClick={() => {
                onDelete?.(F.id);
                setDeletePopupVisible(false);
              }}
            >
              Conferma
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => setDeletePopupVisible(false)}
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* POPUP OFFERTA */}
      {bidPopupVisible && (
        <div className={styles.deletePopUp}>
          <h3 className={styles.text}>Inserisci la tua offerta</h3>
          <p className={styles.text}>Digita l'importo in ETH.</p>
          <input
            type="number"
            step="0.0001"
            value={bidValue}
            onChange={(e) => setBidValue(e.target.value)}
            className={styles.inputBid}
            placeholder="0 ETH"
          />

          <div className={styles.buttonGroup}>
            <button
              className={styles.btnConfirm}
              onClick={() => {
                if (!bidValue || Number(bidValue) <= 0) return;
                onBid(F.id, bidValue);
                setBidPopupVisible(false);
                setBidValue("");
              }}
            >
              Invia offerta
            </button>

            <button
              className={styles.btnCancel}
              onClick={() => {
                setBidPopupVisible(false);
                setBidValue("");
              }}
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
