require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Porta predefinita Ganache GUI
      accounts: [process.env.GANACHE_PRIVATE_KEY],
    },
  },
};
