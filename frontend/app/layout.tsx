"use client";
import "./globals.css";

import { ChakraProvider } from "@chakra-ui/react";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, goerli } from "wagmi/chains";
import { pinFileToIPFS } from "./util/ipfs";

const chains = [arbitrum, mainnet, polygon, goerli];
const projectId = "0428dfd8676dea37c88c6638615d3790";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout(params: any) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <WagmiConfig client={wagmiClient}>{params?.children}</WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </ChakraProvider>
      </body>
    </html>
  );
}
