import React, { useEffect, useState } from "react";
import { getProviderAndSigner, networkOk } from "../lib/eth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "../styles/ConnectButton.css";

library.add(faCircleUser);

export default function ConnectButton({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  async function connect() {
    try {
      const { provider, signer } = await getProviderAndSigner();
      const addr = await signer.getAddress();
      const net = await networkOk(provider);
      setAccount(addr);
      setChain(net?.chainId?.toString());
      onConnected({ provider, signer, account: addr, chainId: net.chainId });
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div>
      <button className="btn" onClick={() => setShowPopup(!showPopup)}>
        <FontAwesomeIcon icon={["fas", "circle-user"]} />
      </button>

      {showPopup && !account && (
        <div className="popup-container">
          <button onClick={connect} className="connect-btn">
            Accedi con MetaMask
          </button>
        </div>
      )}

      {showPopup && account && (
        <div className="popup-container">
          <a className="profile-link" href="/profile">
            Vai alla tua pagina personale →
          </a>
        </div>
      )}
    </div>
  );
}
