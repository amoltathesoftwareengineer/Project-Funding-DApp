
import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ABI = [
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (address creator, string title, string description, uint256 goal, uint256 deadline, uint256 amountRaised, bool claimed)",
  "function createCampaign(string title, string description, uint256 goal, uint256 durationInDays)",
  "function contribute(uint256 id) payable"
];

const CONTRACT_ADDRESS = "";

export default function App() {
  const [account, setAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("Connect MetaMask to get started.");

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setStatus("Wallet connected.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  async function getContract() {
    if (!window.ethereum) throw new Error("Install MetaMask first.");
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      throw new Error("Contract address is not configured yet.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  async function loadCampaigns() {
    try {
      const contract = await getContract();
      const count = Number(await contract.campaignCount());
      const items = [];

      for (let i = 0; i < count; i++) {
        const c = await contract.campaigns(i);
        items.push({
          id: i,
          creator: c.creator,
          title: c.title,
          description: c.description,
          goal: c.goal,
          deadline: c.deadline,
          amountRaised: c.amountRaised
        });
      }

      setCampaigns(items);
      setStatus(`Loaded ${items.length} campaigns.`);
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  async function createCampaign(event) {
    event.preventDefault();

    try {
      const contract = await getContract();
      const tx = await contract.createCampaign(
        title,
        description,
        ethers.parseEther(goal),
        7
      );
      setStatus("Creating campaign...");
      await tx.wait();
      setTitle("");
      setDescription("");
      setGoal("");
      await loadCampaigns();
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  async function contribute(id) {
    const amount = window.prompt("Enter contribution in ETH:");
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.contribute(id, {
        value: ethers.parseEther(amount)
      });
      setStatus("Contribution pending...");
      await tx.wait();
      await loadCampaigns();
      setStatus("Contribution confirmed.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">WEB3 • COMMUNITY FUNDING</p>
          <h1>Project Funding DApp</h1>
          <p>Fund ideas. Build possibilities. On the blockchain.</p>
        </div>
        <button onClick={connectWallet}>
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </header>

      <p className="status">{status}</p>

      <section className="panel">
        <h2>Create a campaign</h2>
        <form onSubmit={createCampaign}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Campaign title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            required
          />
          <input
            type="number"
            min="0.000000000000000001"
            step="any"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Funding goal in ETH"
            required
          />
          <button type="submit">Create Campaign (7 days)</button>
        </form>
      </section>

      <section className="campaign-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DISCOVER</p>
            <h2>Community campaigns</h2>
          </div>
          <button className="secondary" onClick={loadCampaigns}>
            Load Campaigns
          </button>
        </div>

        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <article className="campaign-card" key={campaign.id}>
              <span className="campaign-number">CAMPAIGN #{campaign.id}</span>
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <p>
                <strong>{ethers.formatEther(campaign.amountRaised)} ETH</strong>
                {" raised of "}
                {ethers.formatEther(campaign.goal)} ETH
              </p>
              <progress
                value={Number(campaign.amountRaised * 10000n / campaign.goal) / 100}
                max="100"
              />
              <small>Creator: {campaign.creator}</small>
              <button onClick={() => contribute(campaign.id)}>
                Contribute ETH
              </button>
            </article>
          ))}
        </div>

        {campaigns.length === 0 && (
          <p className="empty">Load campaigns to view available funding projects.</p>
        )}
      </section>

      <footer>Built with React, Ethers.js and Ethereum smart contracts.</footer>
    </main>
  );
}
