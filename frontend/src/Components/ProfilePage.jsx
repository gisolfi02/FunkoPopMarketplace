import React, { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { getContract } from "../lib/eth";
import styles from "../styles/ProfilePage.module.css";

export default function ProfilePage({ account }) {
  const [sellingItems, setSellingItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [receivedItems, setReceivedItems] = useState([]);

  async function fetchProfileData() {
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const c = await getContract(provider);

      const n = await c.funkoCount();
      const max = Number(n);
      const selling = [];
      const bought = [];
      const received = [];

      for (let id = 1; id <= max; id++) {
        try {
          const F = await c.funkos(id);

          // Se Funko in vendita (seller === account)
          if (F.seller && F.seller.toLowerCase() === account.toLowerCase()) {
            selling.push(F);
          }

          // Se Funko acquistato (buyer === account)
          if (
            F.buyer &&
            F.buyer.toLowerCase() === account.toLowerCase() &&
            !F.confirmed
          ) {
            bought.push(F);
          }

          // Se Funko ricevuto (buyer === account e confirmed)
          if (
            F.buyer &&
            F.buyer.toLowerCase() === account.toLowerCase() &&
            F.confirmed
          ) {
            received.push(F);
          }
        } catch {}
      }

      setSellingItems(selling);
      setBoughtItems(bought);
      setReceivedItems(received);
    } catch (e) {
      console.log(e);
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
      onSuccess?.("Asta finalizzata!");
    } catch (e) {
      console.log(e.message);
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

  useEffect(() => {
    fetchProfileData();
  }, [account]);

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.h2}>Funko in Vendita / Asta</h2>
      <div className={styles.grid}>
        {sellingItems.length ? (
          sellingItems.map((F) => (
            <ListingCard
              key={String(F.id)}
              F={F}
              me={account}
              onFinalizeAuction={handleFinalizeAuction}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className={styles.p}>Nessun Funko in vendita</p>
        )}
      </div>

      <h2 className={styles.h2}>Funko Acquistati</h2>
      <div className={styles.grid}>
        {boughtItems.length ? (
          boughtItems.map((F) => (
            <ListingCard
              key={String(F.id)}
              F={F}
              me={account}
              onConfirmReceived={handleConfirmReceived}
            />
          ))
        ) : (
          <p className={styles.p}>Nessun Funko acquistato</p>
        )}
      </div>

      <h2 className={styles.h2}>Funko Ricevuti</h2>
      <div className={styles.grid}>
        {receivedItems.length ? (
          receivedItems.map((F) => (
            <ListingCard key={String(F.id)} F={F} me={account} />
          ))
        ) : (
          <p className={styles.p}>Nessun Funko ricevuto</p>
        )}
      </div>
    </div>
  );
}
