import React, { useState } from "react";
import Header from "./Components/Header";
import SellForm from "./Components/SellForm";
import ListingGrid from "./Components/ListingGrid";
import Orders from "./Components/Orders";

export default function App() {
  const [session, setSession] = useState(null); // { provider, signer, account, chainId }

  return (
    <div className="container">
      <Header setSession={setSession} />
    </div>
  );
}
