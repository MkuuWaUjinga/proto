import express, { Request, Response } from "express";
import { ethers } from "ethers";
import { getPrices } from "./thegraphquery";
import dotenv from "dotenv";
dotenv.config();
// Initiate Express App
const app = express();
const port = 3000;
// Set up the provider
let provider = ethers.getDefaultProvider("mainnet");

// Do something every time a new block is mined
provider.on("block", (blockNumber) => {
  console.log("blocknumber", blockNumber);
  getPrices(blockNumber);
  //getPrices(blockNumber);
  // Insert your logic here
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
