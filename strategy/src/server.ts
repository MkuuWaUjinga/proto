import express, { Request, Response } from "express";
import { ethers } from "ethers";
import { getNodeRunnerAddress, getPrices } from "./thegraphquery";
import dotenv from "dotenv";
import StrategyRegistry from "./contracts/StrategyRegistry.json";

dotenv.config();
// Initiate Express App
const app = express();
const port = 3000;
// Set up the provider
let provider = ethers.getDefaultProvider("mainnet");
// Do something every time a new block is mined
provider.on("block", (blockNumber) => {
  console.log("blocknumber", blockNumber - 2);
  const prices = await getPrices(blockNumber - 2);

  console.log(
    "Fetched address of node runner from local server: " +
      getNodeRunnerAddress()
  );

  //execute recommendations
  console.log("Executing recommendations:");

  // Replace with your contract's address
  const contractAddress = "your-contract-address";

  // Replace with your actual private key
  const privateKey = process.env.PRIVATE_KEY;

  // Replace with the URL of your Ethereum node
  const providerUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";

  // Create a new provider
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  // Create a new wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a new contract instance
  const contract = new ethers.Contract(
    contractAddress,
    StrategyRegistry.abi,
    wallet
  );

  // Replace these values with your actual inputs
  const beneficiary = getNodeRunnerAddress();
  const strategyID = 1;
  const tickLower = ethers.utils.parseUnits(
    (prices.apecoinPrice * 0.9).toFixed(0),
    "wei"
  );
  const tickUpper = ethers.utils.parseUnits(
    (prices.apecoinPrice * 0.9).toFixed(0),
    "wei"
  );
  const amount0Desired = ethers.utils.parseUnits("1", "wei");
  const amount1Desired = ethers.utils.parseUnits("1", "wei");
  const amount0Min = ethers.utils.parseUnits("1", "wei");
  const amount1Min = ethers.utils.parseUnits("1", "wei");

  async function runStrategy() {
    try {
      const tx = await contract.runStrategy(
        strategyID,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min
      );
      console.log("Transaction sent: ", tx.hash);
      await tx.wait();
      console.log("Transaction completed");
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  runStrategy();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
