const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the NFT Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevsNFT");
  await nftContract.waitForDeployment();
  console.log("CryptoDevsNFT deployed to:", nftContract.target);

  // Deploy the Fake Marketplace Contract
  const fakeNftMarketplaceContract = await hre.ethers.deployContract(
    "FakeNFTMarketplace"
  );
  await fakeNftMarketplaceContract.waitForDeployment();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.target
  );

  // Deploy the DAO Contract
  const amount = hre.ethers.parseEther("0.0001"); // You can change this value from 1 ETH to something else

  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();

  // Deploy CryptoDevsDAO with the deployer's address as the initial owner
  const daoContract = await hre.ethers.deployContract("CryptoDevsDAO", [
    fakeNftMarketplaceContract.target,
    nftContract.target,
    deployer.address, // Pass the initial owner address
  ], { value: amount });
  await daoContract.waitForDeployment();
  console.log("CryptoDevsDAO deployed to:", daoContract.target);

  // Sleep for 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // Verify the NFT Contract
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: [],
  });

  // Verify the Fake Marketplace Contract
  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.target,
    constructorArguments: [],
  });

  // Verify the DAO Contract
  await hre.run("verify:verify", {
    address: daoContract.target,
    constructorArguments: [
      fakeNftMarketplaceContract.target,
      nftContract.target,
      deployer.address, // Pass the initial owner address
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});






/* 
CryptoDevsNFT deployed to: 0xE1AC431caCB059879e89f40df924582805E2545F
FakeNFTMarketplace deployed to: 0xdC6F29b4EF04D97642496E3d4384FD375A637D33
CryptoDevsDAO deployed to: 0x54A865d08B16FA00DB876FCDDdbA9891895e88D3 
*/