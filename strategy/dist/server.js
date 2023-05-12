"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const thegraphquery_1 = require("./thegraphquery");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initiate Express App
const app = (0, express_1.default)();
const port = 3000;
// Set up the provider
let provider = ethers_1.ethers.getDefaultProvider("mainnet");
// Do something every time a new block is mined
provider.on("block", (blockNumber) => {
    console.log("blocknumber", blockNumber);
    (0, thegraphquery_1.getPrices)(blockNumber);
    // Insert your logic here
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map