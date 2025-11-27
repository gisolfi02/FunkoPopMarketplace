import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProviderAndSigner, networkOk } from "../lib/eth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faArrowRightFromBracket,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import styles from "../styles/ConnectButton.module.css";

library.add(faCircleUser, faArrowRightFromBracket, faAddressCard, faCirclePlus);

export default function ConnectButton({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  async function connect() {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const selectedAccount = accounts[0];

      const { provider, signer } = await getProviderAndSigner();
      const net = await networkOk(provider);

      setAccount(selectedAccount);
      localStorage.setItem("account", selectedAccount);
      setChain(net?.chainId?.toString());

      onConnected({
        provider,
        signer,
        account: selectedAccount,
        chainId: net.chainId,
      });
      setShowPopup(!showPopup);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  function logout() {
    setAccount(null);
    setChain(null);
    setShowPopup(false);
    localStorage.removeItem("account");
    navigate("/");
    window.location.reload();
  }

  useEffect(() => {
    const saved = localStorage.getItem("account");
    if (saved) {
      setAccount(saved);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (acc) => {
      if (acc.length === 0) {
        setAccount(null);
        localStorage.removeItem("account");
      } else {
        setAccount(acc[0]);
        localStorage.setItem("account", acc[0]);
      }
    });

    window.ethereum.on("chainChanged", () => {
      setChain(null);
    });

    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, []);

  return (
    <div>
      <button className={styles.btn} onClick={() => setShowPopup(!showPopup)}>
        <FontAwesomeIcon icon={["fas", "circle-user"]} />
      </button>

      {showPopup && !account && (
        <div className={styles["popup-container"]}>
          <button onClick={connect} className={styles["connect-btn"]}>
            Accedi con MetaMask
          </button>
        </div>
      )}

      {showPopup && account && (
        <div className={styles["popup-container"]}>
          <a className={styles["profile-link"]} href="/profile">
            Vai al Profilo
            <FontAwesomeIcon
              icon={["far", "address-card"]}
              size="lg"
              style={{ marginLeft: "5px" }}
            />
          </a>
          <a className={styles["sell-link"]} href="/sell">
            Crea Annuncio
            <FontAwesomeIcon
              icon={["fas", "circle-plus"]}
              style={{ marginLeft: "5px" }}
            />
          </a>
          <button className={styles["logout-btn"]} onClick={logout}>
            Logout
            <FontAwesomeIcon
              icon={["fas", "arrow-right-from-bracket"]}
              style={{ marginLeft: "5px" }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
