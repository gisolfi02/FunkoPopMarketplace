import React, { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { getContract } from "../lib/eth";
import styles from "../styles/ListingGrid.module.css";
import sadFace from "../img/sad.png";

export default function ListingGrid({ account, mode }) {
  const [items, setItems] = useState([]);

  async function fetchListings() {
    setLoading(true);
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const c = await getContract(provider);

      const n = await c.funkoCount();
      const max = Number(n);
      const acc = [];
      // Leggiamo direttamente il mapping pubblico `funkos(id)`
      for (let id = 1; id <= max; id++) {
        try {
          const F = await c.funkos(id);
          if (!F || !F.id || Number(F.id) === 0) continue;

          if (mode === "sale" && F.isAuction) continue;
          if (mode === "auction" && !F.isAuction) continue;

          acc.push(F);
        } catch {}
      }
      setItems(acc);
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    fetchListings();
  }, [mode]);

  async function handleBuy(id, priceWei) {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);
      const tx = await c.buyFunkoPop(id, { value: priceWei });
      await tx.wait();
      await fetchListings();
      alert("Acquisto effettuato!");
    } catch (e) {
      alert(e.message);
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
        <ListingCard key={String(F.id)} F={F} me={account} onBuy={handleBuy} />
      ))}
    </div>
  );
}
