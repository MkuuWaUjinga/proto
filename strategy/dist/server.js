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
const port = 3000;
// Set up the provider
let provider = new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "0x0a3aa4174d27fbd3c7b9ce000cb200b1a1563334";
// this assumes that the noderunner is already registered
provider.on("block", async (blockNumber) => {
    console.log("blocknumber", blockNumber - 2);
    const prices = await (0, thegraphquery_1.getPrices)(blockNumber - 2);
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
    const strategyID = 1;
    const tickLower = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 0.9).toFixed(0), "wei");
    const tickUpper = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 1.1).toFixed(0), "wei");
    async function runStrategy() {
        try {
            const tx1 = await contract.getStrategyByID(strategyID);
            console.log("tx1", tx1);
            const txResult = await tx1.wait();
            console.log("txresult", txResult);
            const amount0Desired = ethers_1.ethers.utils.parseUnits("1", "wei");
            const amount1Desired = ethers_1.ethers.utils.parseUnits("1", "wei");
            const tx = await contract.runStrategy(strategyID, tickLower, tickUpper, amount0Desired, amount1Desired);
            console.log("Transaction sent: ", tx.hash);
            await tx.wait();
            console.log("Transaction completed");
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }
    runStrategy();
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map