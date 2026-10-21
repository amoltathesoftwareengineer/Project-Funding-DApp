# 💰 Project Funding DApp

A decentralized crowdfunding application built using Ethereum, Solidity, smart contracts, and React.js. The project demonstrates how blockchain technology can enable transparent and verifiable funding campaigns.

## 📌 Project Overview

Project Funding DApp allows users to create funding campaigns, contribute cryptocurrency, and monitor campaign progress through a decentralized application (DApp).

Smart contracts manage campaign details and contributions on the blockchain, reducing reliance on a centralized funding platform.

This project is intended for educational and development purposes.

## ✨ Features

- 🔗 Connect an Ethereum wallet using MetaMask
- 📝 Create and manage funding campaigns
- 💸 Contribute cryptocurrency to campaigns
- 📊 Track campaign funding progress
- 🔍 View campaign details and contributions
- 🔐 Interact with Ethereum smart contracts
- 📜 View transaction status and blockchain records
- 📱 Responsive user interface

## 🛠️ Technologies Used

**Blockchain**
- Ethereum
- Solidity
- Smart Contracts

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3

**Development Tools**
- Hardhat
- MetaMask
- Ethers.js
- Node.js
- npm

## 📂 Project Structure

```text
Project-Funding-DApp/
├── contracts/
│   └── Funding.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── Funding.test.js
├── client/
│   ├── src/
│   └── package.json
├── hardhat.config.js
├── package.json
├── .gitignore
└── README.md
```

*The directory and file names above are a suggested structure. Adjust them to match the actual files in your repository.*

## 🚀 Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Git
- MetaMask browser extension

### 1. Clone the Repository

```bash
git clone https://github.com/amoltathasoftwareengineer/Project-Funding-DApp.git
cd Project-Funding-DApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Smart Contracts

```bash
npx hardhat compile
```

### 4. Run Smart Contract Tests

```bash
npx hardhat test
```

### 5. Start a Local Blockchain

```bash
npx hardhat node
```

Keep this terminal running.

### 6. Deploy the Smart Contract

Open another terminal in the project directory and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Use the deployed contract address in the frontend configuration.

### 7. Run the Frontend

If the frontend is located in the `client` directory:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal and connect MetaMask to the configured development network.

*These commands assume the project uses Hardhat and the suggested file structure. Update them if your implementation uses different tools or paths.*

## 🔄 How It Works

1. A user connects their Ethereum wallet.
2. The user creates or browses funding campaigns.
3. Contributors send funds through the campaign smart contract.
4. The contract records contributions and updates campaign progress.
5. Users can inspect campaign information and transaction records on the blockchain.

## 🔐 Security Considerations

- Use a local blockchain or test network during development.
- Never commit wallet private keys, seed phrases, or secret credentials.
- Validate campaign inputs and enforce smart-contract access controls.
- Test contribution handling, withdrawal rules, and failure cases.
- Obtain an independent security review before any real-fund deployment.

## 🎯 Learning Objectives

- Understanding decentralized application architecture
- Writing Solidity smart contracts
- Integrating React with Ethereum
- Connecting MetaMask to a DApp
- Testing and deploying smart contracts
- Understanding blockchain transactions

## 🔮 Future Enhancements

- Campaign deadlines and funding goals
- Automated refund handling for unsuccessful campaigns
- Campaign categories and search
- Transaction history dashboard
- Improved accessibility and responsive design
- Smart-contract security testing

## 👨‍💻 Author

**Amol Tathe**

- GitHub: [@amoltathasoftwareengineer](https://github.com/amoltathasoftwareengineer)
- LinkedIn: [Amol Tathe](https://www.linkedin.com/in/amoltathesoftwareengineer/)

## 📄 License

No license has been specified yet.
