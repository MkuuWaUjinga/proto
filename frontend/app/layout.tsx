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
import { arbitrum, mainnet, polygon, goerli, localhost } from "wagmi/chains";
import { pinFileToIPFS } from "./util/ipfs";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Component, ErrorInfo, ReactNode, useEffect } from "react";

const chains = [localhost];
const projectId = "0428dfd8676dea37c88c6638615d3790";

const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `http://localhost:8545`,
    }),
  }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

// do not cache this layout
// export const revalidate = 0;

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI here
      return <div>An error occurred. Please try again.</div>;
    }

    // Render the children if no error occurred
    return this.props.children;
  }
}

export default async function RootLayout(params: any) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ChakraProvider>
            <WagmiConfig client={wagmiClient}>{params?.children}</WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </ChakraProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
