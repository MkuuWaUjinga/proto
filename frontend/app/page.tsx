"use client";
import { Spinner, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import StrategiesTable from "../components/strategiesTable";
import { useContractRead } from "wagmi";
import { strategyAddress } from "./util/addresses";
import StrategyRegistry from "../contracts/StrategyRegistry.json";

export default function MainPage() {
  const [strategies, setStrategies] = useState();
  const { data, isError, isLoading } = useContractRead({
    address: strategyAddress,
    abi: StrategyRegistry.abi,
    functionName: "getStrategies",
  });
  if (!isLoading) {
    return (
      <>
        <VStack spacing={4} align="stretch">
          <Navbar />
          <StrategiesTable strategies={data} />
        </VStack>
      </>
    );
  } else {
    <Spinner />;
  }
}
