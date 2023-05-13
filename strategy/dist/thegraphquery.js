"use strict";
// Set up the subgraph endpoint
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrices = void 0;
const subgraphEndpoint = `https://gateway.thegraph.com/api/${process.env.GRAPH_API}/subgraphs/id/ELUcwgpm14LKPLrBRuVvPvNKHQ9HvwmtKgKSH6123cr7`;
// Helper function to make GraphQL requests
async function makeGraphRequest(query) {
    console.log("nfe", JSON.stringify({ query: query }));
    const response = await fetch(subgraphEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
    });
    const data = await response.json();
    return data;
}
async function getPrices(blockNumber) {
    var _a, _b;
    console.log("e", subgraphEndpoint);
    // Retrieve the price of USDC and Apecoin
    const tokenQuery = `query {usdcToken: token(id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", block: {number: ${blockNumber}}) {id lastPriceUSD} apecoinToken: token(id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", block: { number: ${blockNumber}}) {id lastPriceUSD}}`;
    const tokenData = await makeGraphRequest(tokenQuery);
    console.log("tokendata", tokenData);
    const usdcPrice = (_a = tokenData.usdcToken) === null || _a === void 0 ? void 0 : _a.lastPriceUSD;
    const apecoinPrice = (_b = tokenData.apecoinToken) === null || _b === void 0 ? void 0 : _b.lastPriceUSD;
    console.log(`USDC Price: ${usdcPrice}`);
    console.log(`Apecoin Price: ${apecoinPrice}`);
    // Retrieve historical prices from swaps in the last few blocks
    const blocksToCheck = 10;
    const swapQuery = `
    query {
      swaps(
        first: ${blocksToCheck},
        orderBy: timestamp,
        orderDirection: desc,
        where: {
          timestamp_gt: ${Math.floor(Date.now() / 1000) - blocksToCheck * 15} // Assuming each block takes approximately 15 seconds
        }
      ) {
        id
        timestamp
        amountIn
        amountOut
      }
    }
  `;
    const swapData = await makeGraphRequest(swapQuery);
    const historicalPrices = swapData.swaps.map((swap) => {
        const price = parseFloat(swap.amountOut) / parseFloat(swap.amountIn);
        return { timestamp: swap.timestamp, price };
    });
    console.log("Historical Prices:");
    console.log(historicalPrices);
}
exports.getPrices = getPrices;
//# sourceMappingURL=thegraphquery.js.map