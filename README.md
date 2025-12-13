# Funko Pop MarketPlace

<p align="center">
  <img src="./frontend/src/img/logo.png" style="width:300px">
</p>

A decentralized marketplace for buying and selling Funko Pop collectibles built on **Ethereum.**

The project uses **smart contracts, IPFS decentralized storage**, and a **React + Vite** frontend to simulate a real-world blockchain-based e-commerce platform.

---

## 👥 Authors

- [Andrea Gisolfi](mailto:a.gisolfi4@studenti.unisa.it)
- [Silvana Cafaro](mailto:s.cafaro7@studenti.unisa.it)

---

## 🛠️ Technologies Used

**Frontend**: React + Vite, JavaScript (ES6+), Ethers.js, MetaMask Integration, Lighthouse / IPFS (for decentralized image storage)

**Smart Contracts**: Solidity, Hardhat, Ethereum (Ganache / Sepolia testnet)

**Other Tools**: Node.js, NPM

---

## 📁 Project Structure

```
📁 project-root/
│
├── 📁 contracts/                 # Solidity smart contracts
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 Components/        # React components (UI logic)
│   │   ├── 📁 img/               # Static images
│   │   ├── 📁 lib/               # Helpers (wallet, IPFS, blockchain calls)
│   │   ├── 📁 styles/            # CSS and global styles
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Entry point for React
│   │
│   ├── index.html             # Main HTML file for Vite
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│
├── 📁 ignition/modules/          # Hardhat Ignition deployment modules
│
├── 📁scripts/               # Compile script
|
├── hardhat.config.js
├── package.json
│
└── README.md                  # Project documentation
```

---

## 📦 Requirements

Before running the project, make sure you have:

- Node.js (v16 or higher)
- NPM
- MetaMask installed
- Ganache OR Sepolia RPC endpoint

---

## 🚀 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone <repo-url>
cd project-root
```

### 2️⃣ Install Dependecies

```bash
npm install
cd frontend && npm install
```

### 3️⃣ Configure Environment variables

Create a `.env` file in root:

```bash
touch .env
```

Insert in the `.ev` file

```bash
GANACHE_PRIVATE_KEY = PRIVATE_KEY_OF_A_GANACHE_ACCOUNT
```

Create a `.env` in `/frontend`:

```bash
cd frontend
touch .env
```

Insert in the `.env` file:

```bash
VITE_LIGHTHOUSE_KEY= YOUR_LIGHTHOUSE_API_KEY
VITE_CONTRACT_ADDRESS= #it will be automatically filled
```

### 4️⃣ Deploy the contract

In root run:

```bash
npm run compile
```
It will complie the contract in ```/contracts```, deploy it to **Ganache** and set up the environment variable ```VITE_CONTRACT_ADRRESS```

### 5️⃣​ Start the frontend

```bash
cd fronted
npm run dev
```

Starts the frontend on **_localhost:5173_**
