import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useNavigate } from "react-router-dom";
import ListingGrid from "./Components/ListingGrid";
import SellForm from "./Components/SellForm";
import styles from "./styles/App.module.css";
import happyFace from "./img/happy.png";

export default function App() {
  const [session, setSession] = useState(null); // { provider, signer, account, chainId }
  const [viewMode, setViewMode] = useState("sale"); // "sale" | "auction"
  const [search, setSearch] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

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

  function notifySuccess() {
    setSuccessVisible(true);
    setFadeOut(false);

    navigate("/");

    setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    setTimeout(() => {
      setSuccessVisible(false);
    }, 2400);
  }

  return (
    <div className="container">
      {/* Header sempre presente */}
      <Header setSession={setSession} onSearch={setSearch} />

      {successVisible && (
        <div
          className={`${styles["success-popup"]} ${
            fadeOut ? styles["fade-out"] : ""
          }`}
        >
          <img
            src={happyFace}
            alt="Success"
            height={300}
            className={styles.imgSuccess}
          />
          <h2>Annuncio creato con successo!</h2>
        </div>
      )}

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
        <Route
          path="/sell"
          element={
            <SellForm account={session?.account} onCreated={notifySuccess} />
          }
        />

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
