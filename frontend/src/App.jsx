import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ListingGrid from "./Components/ListingGrid";
import SellForm from "./Components/SellForm";
import styles from "./styles/App.module.css";

export default function App() {
  const [session, setSession] = useState(null); // { provider, signer, account, chainId }
  const [viewMode, setViewMode] = useState("sale"); // "sale" | "auction"
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("account");
    if (saved && !session) {
      setSession({
        provider: null,
        signer: null,
        account: saved,
        chainId: null,
      });
    }
  }, []);

  return (
    <div className="container">
      {/* Header sempre presente */}
      <Header setSession={setSession} onSearch={setSearch} />

      {/* Rotte del sito */}
      <Routes>
        {/* ---------------- HOME ---------------- */}
        <Route
          path="/"
          element={
            <>
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
              />
            </>
          }
        />

        {/* ---------------- PAGINA CREA ANNUNCIO ---------------- */}
        <Route path="/sell" element={<SellForm account={session?.account} />} />

        {/* ---------------- PAGINA PROFILO ---------------- */}
        <Route
          path="/profile"
          element={
            <div style={{ padding: 40 }}>Pagina profilo in arrivo...</div>
          }
        />
      </Routes>

      {/* Footer sempre presente */}
      <Footer />
    </div>
  );
}
