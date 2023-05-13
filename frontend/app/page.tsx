"use client";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import StrategiesTable, { Strategy } from "../components/strategiesTable";
import { useContractRead } from "wagmi";
import { strategyAddress } from "./util/addresses";
import StrategyRegistry from "../contracts/StrategyRegistry.json";
import { switchNetwork } from "@wagmi/core";

export default function MainPage() {
  console.log("moin");
  const { data, isError, isLoading } = useContractRead({
    address: strategyAddress,
    abi: StrategyRegistry.abi,
    functionName: "getStrategies",
    enabled: false,
  });
  console.log("Strats", data);
  if (!isLoading) {
    return (
      <>
        <VStack spacing={4} align="stretch">
          <Navbar />
          <StrategiesTable strategies={(data || []) as Strategy[]} />
        </VStack>
      </>
    );
  } else {
    <Spinner />;
  }
}
