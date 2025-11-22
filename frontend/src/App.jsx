import React, { useState } from "react";
import Header from "./Components/Header";
import ListingGrid from "./Components/ListingGrid";
import styles from "./styles/App.module.css";
import SellForm from "./Components/SellForm";

export default function App() {
  const [session, setSession] = useState(null); // { provider, signer, account, chainId }
  const [viewMode, setViewMode] = useState("sale"); // "sale" | "auction"
  const [search, setSearch] = useState("");

  return (
    <div className="container">
      <Header setSession={setSession} onSearch={setSearch} />
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
      <ListingGrid
        account={session?.account}
        mode={viewMode}
        search={search}
      ></ListingGrid>
    </div>
  );
}
