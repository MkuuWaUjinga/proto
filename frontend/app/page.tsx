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
  // if (!isLoading) {
  return (
    <>
      <VStack spacing={4} align="stretch">
        <Navbar />
        <StrategiesTable />
      </VStack>
    </>
  );
  // } else {
  //   <Spinner />;
  // }
}
