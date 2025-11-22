import React, { useState } from "react";
import Header from "./Components/Header";
import ListingGrid from "./Components/ListingGrid";
import styles from "./styles/App.module.css";

export default function App() {
  const [session, setSession] = useState(null); // { provider, signer, account, chainId }
  const [viewMode, setViewMode] = useState("sale"); // "sale" | "auction"

  return (
    <div className="container">
      <Header setSession={setSession} />
      <div className={styles.selection}>
        <button
          className={styles.btnLeft}
          disabled={viewMode === "sale"}
          onClick={() => setViewMode("sale")}
        >
          In Vendita
        </button>
        <button
          className={styles.btnRight}
          disabled={viewMode === "auction"}
          onClick={() => setViewMode("auction")}
        >
          All'Asta
        </button>
      </div>
      <ListingGrid account={session?.account} mode={viewMode}></ListingGrid>
    </div>
  );
}
