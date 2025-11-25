import ConnectButton from "./ConnectButton";
import logo from "../img/logo.png";
import { getContract } from "../lib/eth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Header.module.css";

library.add(faMagnifyingGlass);

export default function Header({ setSession, onSearch }) {
  return (
    <header>
      <a href="/">
        <img src={logo} alt="Logo" height={150} />
      </a>
      <div className={styles.searchContainer}>
        <FontAwesomeIcon
          icon={["fas", "magnifying-glass"]}
          style={{ color: "#2C2C2C", marginRight: "5px" }}
        />
        <input
          className={styles.search}
          type="text"
          placeholder="Cerca Funko"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <ConnectButton onConnected={setSession} />
    </header>
  );
}
