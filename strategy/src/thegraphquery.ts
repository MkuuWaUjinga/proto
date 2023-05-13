// Set up the subgraph endpoint

const subgraphEndpoint = `https://gateway.thegraph.com/api/${process.env.GRAPH_API}/subgraphs/id/ELUcwgpm14LKPLrBRuVvPvNKHQ9HvwmtKgKSH6123cr7`;

// Helper function to make GraphQL requests
async function makeGraphRequest(query: string) {
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

export function getNodeRunnerAddress() {
  return "0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE";
}

export async function getPrices(blockNumber: number) {
  console.log(
    "Retrieving the price of USDC and Apecoin and doing statistical analysis"
  );

  const tokenQuery = `query {usdcToken: token(id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", block: {number: ${blockNumber}}) {id lastPriceUSD} apecoinToken: token(id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", block: { number: ${blockNumber}}) {id lastPriceUSD}}`;

  const tokenData = await makeGraphRequest(tokenQuery);
  const usdcPrice = tokenData.data.usdcToken?.lastPriceUSD;
  const apecoinPrice = tokenData.data.apecoinToken?.lastPriceUSD;

  console.log(`USDC Price: ${usdcPrice}`);
  console.log(`Apecoin Price: ${apecoinPrice}`);

  //Retrieve historical prices from swaps in the last few blocks and do some data analysis
  //todo

  return { usdcPrice: usdcPrice, apecoinPrice: apecoinPrice };
}
