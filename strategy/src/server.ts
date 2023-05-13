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
let provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "0x0a3aa4174d27fbd3c7b9ce000cb200b1a1563334";

// this assumes that the noderunner is already registered
provider.on("block", async (blockNumber) => {
  console.log("blocknumber", blockNumber - 2);
  const prices = await getPrices(blockNumber - 2);
  const beneficiary = getNodeRunnerAddress();

  console.log(
    "Fetched address of node runner from local server: " + beneficiary
  );

  //execute recommendations
  console.log("Executing recommendations:");

  // Replace with your actual private key
  const privateKey = process.env.PRIVATE_KEY;

  // Replace with the URL of your Ethereum node

  // Create a new provider

  // Create a new wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a new contract instance
  const contract = new ethers.Contract(
    contractAddress,
    StrategyRegistry.abi,
    wallet
  );

  // Replace these values with your actual inputs
  const strategyID = 1;
  const tickLower = ethers.utils.parseUnits(
    (prices.apecoinPrice * 0.9).toFixed(0),
    "wei"
  );
  const tickUpper = ethers.utils.parseUnits(
    (prices.apecoinPrice * 1.1).toFixed(0),
    "wei"
  );
  async function runStrategy() {
    try {
      const tx1 = await contract.getStrategyByID(strategyID);
      const amount0Desired = ethers.utils.parseUnits(
        (tx1.capitalAllocated1 - tx1.capitalDeposited1).toString(),
        "wei"
      );
      const amount1Desired = ethers.utils.parseUnits(
        (tx1.capitalAllocated2 - tx1.capitalDeposited2).toString(),
        "wei"
      );

      const tx = await contract.runStrategy(
        strategyID,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired
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
