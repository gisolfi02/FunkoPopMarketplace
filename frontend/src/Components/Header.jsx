import ConnectButton from "./ConnectButton";
import logo from "../img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";

library.add(faMagnifyingGlass);

export default function Header({ setSession }) {
  return (
    <header>
      <img src={logo} alt="Logo" height={150} />
      <div className="searchContainer">
        <FontAwesomeIcon
          icon={["fas", "magnifying-glass"]}
          style={{ color: "#2C2C2C", marginRight: "5px" }}
        />
        <input className="search" type="text" placeholder="Cerca Funko" />
      </div>
      <ConnectButton onConnected={setSession} />
    </header>
  );
}
