import React, { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { getContract } from "../lib/eth";
import styles from "../styles/ListingGrid.module.css";
import sadFace from "../img/sad.png";

export default function ListingGrid({ account, mode, search, onSuccess }) {
  const [items, setItems] = useState([]);

  async function fetchListings() {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const c = await getContract(provider);

      const n = await c.funkoCount();
      const max = Number(n);
      const acc = [];
      for (let id = 1; id <= max; id++) {
        try {
          const F = await c.funkos(id);
          if (!F || F.id === undefined || F.id === null) continue;

          if (mode === "sale" && F.isAuction) continue;
          if (mode === "auction" && !F.isAuction) continue;
          acc.push(F);
        } catch {}
      }

      const filtered = acc.filter((F) => {
        const q = search.toLowerCase();
        return (
          F.nameFunko?.toLowerCase().includes(q) ||
          F.description?.toLowerCase().includes(q)
        );
      });

      setItems(filtered);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    fetchListings();
  }, [mode, search]);

  async function handleBuy(id, priceWei) {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);
      const tx = await c.buyFunko(id, { value: priceWei });
      await tx.wait();
      await fetchListings();
      onSuccess?.("Acquisto effettuato!");
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleBid(id, ethAmount) {
    try {
      const amountWei = (await import("ethers")).parseEther(ethAmount);

      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);

      const tx = await c.placeBid(id, { value: amountWei });
      await tx.wait();
      await fetchListings();
      onSuccess?.("Offerta inviata!");
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleFinalizeAuction(id) {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);

      const tx = await c.finalizeAuction(id);
      await tx.wait();
      await fetchListings();
      onSuccess?.("Asta finalizzata con successo!");
    } catch (e) {
      console.error("Errore durante la finalizzazione dell'asta:", e.message);

      // Se il contratto restituisce un errore revert, mostriamo il messaggio
      if (e.code === "CALL_EXCEPTION") {
        console.error("Revert della transazione:", e.data);
        alert(
          "Impossibile finalizzare l'asta. Verifica che l'asta sia terminata o già finalizzata."
        );
      } else {
        alert("Si è verificato un errore durante la finalizzazione.");
      }
    }
  }

  async function handleConfirmReceived(id) {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);

      let tx;
      tx = await c.confirmRecived(id);

      await tx.wait();
      await fetchListings();
      onSuccess?.("Ricezione confermata!");
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleDelete(id) {
    try {
      console.log("Deleting item with id:", id);
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);

      const tx = await c.deleteFunko(id);
      await tx.wait();
      await fetchListings();
      onSuccess?.("Annuncio eliminato!");
    } catch (e) {
      console.log(e.message);
    }
  }

  if (!items.length)
    return (
      <div className={styles.info}>
        <img src={sadFace} alt="Sad face" height={300} />
        <h2>Nessun Funko Trovato.</h2>
      </div>
    );

  return (
    <div className={styles.grid}>
      {items.map((F) => (
        <ListingCard
          key={String(F.id)}
          F={F}
          me={account}
          onBuy={handleBuy}
          onBid={handleBid}
          onFinalizeAuction={handleFinalizeAuction}
          onConfirmReceived={handleConfirmReceived}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
