"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const thegraphquery_1 = require("./thegraphquery");
const dotenv_1 = __importDefault(require("dotenv"));
const StrategyRegistry_json_1 = __importDefault(require("./contracts/StrategyRegistry.json"));
dotenv_1.default.config();
// Initiate Express App
const app = (0, express_1.default)();
const port = 4000;
// Set up the provider
let provider = new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "0x0a3aa4174D27fbd3c7B9ce000Cb200B1A1563334";
// this assumes that the noderunner is already registered
provider.on("block", async (blockNumber) => {
    console.log("blocknumber", blockNumber - 2);
    // TODO block number hardcoded bc of foundry
    const prices = await (0, thegraphquery_1.getPrices)(17254047 - 2);
    const beneficiary = (0, thegraphquery_1.getNodeRunnerAddress)();
    console.log("Fetched address of node runner from local server: " + beneficiary);
    //execute recommendations
    console.log("Executing recommendations:");
    // Replace with your actual private key
    const privateKey = process.env.PRIVATE_KEY;
    // Replace with the URL of your Ethereum node
    // Create a new provider
    // Create a new wallet instance
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    // Create a new contract instance
    const contract = new ethers_1.ethers.Contract(contractAddress, StrategyRegistry_json_1.default.abi, wallet);
    // Replace these values with your actual inputs
    const strategyID = 0;
    const tickLower = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 0.9).toFixed(0), "wei");
    const tickUpper = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 1.1).toFixed(0), "wei");
    const tx = await contract.registerNodeRunner(strategyID, 1, ethers_1.ethers.utils.formatBytes32String("r"), ethers_1.ethers.utils.formatBytes32String("s"));
    await tx.wait();
    async function runStrategy() {
        try {
            const tx1 = await contract.getStrategyByID(strategyID);
            const amount0Desired = ethers_1.ethers.utils.parseUnits((tx1.capitalAllocated1 - tx1.capitalDeposited1).toString(), "wei");
            const amount1Desired = ethers_1.ethers.utils.parseUnits((tx1.capitalAllocated2 - tx1.capitalDeposited2).toString(), "wei");
            console.log("--------- Running strategy ----------");
            const tx = await contract.runStrategy(strategyID, tickLower, tickUpper, amount0Desired, amount1Desired);
            console.log("Transaction sent: ", JSON.parse(JSON.stringify(tx.hash)));
            await tx.wait();
            console.log("Transaction completed");
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }
    await runStrategy();
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map