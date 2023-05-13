export const strategyAddress = "0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE";

export const assetNameToTokenAdress: { [x: string]: string } = {
  ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  APEcoin: "0x4d224452801aced8b2f0aebe155379bb5d594381", // todo fix balance retrieval for tokens. currently throws ContractMethodNoResultError
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};

export const tokenAddressToAssetName: { [x: string]: string } = {
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "WETH",
  "0x4d224452801aced8b2f0aebe155379bb5d594381": "APEcoin", // todo fix balance retrieval for tokens. currently throws ContractMethodNoResultError
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
};
