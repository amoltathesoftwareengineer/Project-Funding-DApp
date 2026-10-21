
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Funding", function () {
  async function deployFunding() {
    const [owner, contributor] = await ethers.getSigners();
    const Funding = await ethers.getContractFactory("Funding");
    const funding = await Funding.deploy();
    await funding.waitForDeployment();

    return { funding, owner, contributor };
  }

  it("should create a campaign", async function () {
    const { funding, owner } = await deployFunding();

    await funding.createCampaign(
      "Education Fund",
      "Support student education",
      ethers.parseEther("1"),
      7
    );

    const campaign = await funding.campaigns(0);

    expect(campaign.creator).to.equal(owner.address);
    expect(campaign.title).to.equal("Education Fund");
    expect(await funding.campaignCount()).to.equal(1);
  });

  it("should accept contributions", async function () {
    const { funding, contributor } = await deployFunding();

    await funding.createCampaign(
      "Community Fund",
      "Support the community",
      ethers.parseEther("2"),
      7
    );

    await funding.connect(contributor).contribute(0, {
      value: ethers.parseEther("1")
    });

    expect(await funding.contributions(0, contributor.address))
      .to.equal(ethers.parseEther("1"));
  });

  it("should reject zero contributions", async function () {
    const { funding, contributor } = await deployFunding();

    await funding.createCampaign(
      "Community Fund",
      "Support the community",
      ethers.parseEther("1"),
      7
    );

    await expect(
      funding.connect(contributor).contribute(0, { value: 0 })
    ).to.be.revertedWith("Contribution must be positive");
  });
});
