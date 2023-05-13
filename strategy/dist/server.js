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
let provider = ethers_1.ethers.getDefaultProvider("mainnet");
const contractAddress = "0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE";
// this assumes that the noderunner is already registered
provider.on("block", async (blockNumber) => {
    console.log("blocknumber", blockNumber - 2);
    const prices = await (0, thegraphquery_1.getPrices)(blockNumber - 2);
    console.log("Fetched address of node runner from local server: " +
        (0, thegraphquery_1.getNodeRunnerAddress)());
    //execute recommendations
    console.log("Executing recommendations:");
    // Replace with your actual private key
    const privateKey = process.env.PRIVATE_KEY;
    // Replace with the URL of your Ethereum node
    const providerUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
    // Create a new provider
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(providerUrl);
    // Create a new wallet instance
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    // Create a new contract instance
    const contract = new ethers_1.ethers.Contract(contractAddress, StrategyRegistry_json_1.default.abi, wallet);
    // Replace these values with your actual inputs
    const beneficiary = (0, thegraphquery_1.getNodeRunnerAddress)();
    const strategyID = 1;
    const tickLower = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 0.9).toFixed(0), "wei");
    const tickUpper = ethers_1.ethers.utils.parseUnits((prices.apecoinPrice * 0.9).toFixed(0), "wei");
    const amount0Desired = ethers_1.ethers.utils.parseUnits("1", "wei");
    const amount1Desired = ethers_1.ethers.utils.parseUnits("1", "wei");
    const amount0Min = ethers_1.ethers.utils.parseUnits("1", "wei");
    const amount1Min = ethers_1.ethers.utils.parseUnits("1", "wei");
    async function runStrategy() {
        try {
            const tx = await contract.runStrategy(strategyID, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min);
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