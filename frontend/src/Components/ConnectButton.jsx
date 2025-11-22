import React, { useEffect, useState } from "react";
import { getProviderAndSigner, networkOk } from "../lib/eth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import sytles from "../styles/ConnectButton.module.css";

library.add(faCircleUser, faArrowRightFromBracket);

export default function ConnectButton({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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
    window.location.reload();
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div>
      <button className={sytles.btn} onClick={() => setShowPopup(!showPopup)}>
        <FontAwesomeIcon icon={["fas", "circle-user"]} />
      </button>

      {showPopup && !account && (
        <div className={sytles["popup-container"]}>
          <button onClick={connect} className={sytles["connect-btn"]}>
            Accedi con MetaMask
          </button>
        </div>
      )}

      {showPopup && account && (
        <div className={sytles["popup-container"]}>
          <a className={sytles["profile-link"]} href="/profile">
            TO DO
          </a>
          <button className={sytles["logout-btn"]} onClick={logout}>
            Logout{" "}
            <FontAwesomeIcon icon={["fas", "arrow-right-from-bracket"]} />
          </button>
        </div>
      )}
    </div>
  );
}
