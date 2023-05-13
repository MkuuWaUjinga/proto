"use client";
import { Spinner, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import StrategiesTable, { Strategy } from "../components/strategiesTable";
import { useContractRead } from "wagmi";
import { strategyAddress } from "./util/addresses";
import StrategyRegistry from "../contracts/StrategyRegistry.json";

export default function MainPage() {
  const { data, isError, isLoading } = {
    data: [],
    isError: false,
    isLoading: false,
  };
  // useContractRead({
  //   address: strategyAddress,
  //   abi: StrategyRegistry.abi,
  //   functionName: "getStrategies",
  // });
  console.log("Strats", data);
  if (!isLoading) {
    return (
      <>
        <VStack spacing={4} align="stretch">
          <Navbar />
          <StrategiesTable strategies={data as Strategy[]} />
        </VStack>
      </>
    );
  } else {
    <Spinner />;
  }
}
