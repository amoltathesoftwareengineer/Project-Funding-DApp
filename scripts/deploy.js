
const hre = require("hardhat");

async function main() {
  const Funding = await hre.ethers.getContractFactory("Funding");
  const funding = await Funding.deploy();

  await funding.waitForDeployment();

  console.log(
    "Funding contract deployed to:",
    await funding.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
