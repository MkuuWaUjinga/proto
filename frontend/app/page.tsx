"use client"
import { VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar"
import StrategiesTable from "../components/strategiesTable"

const strategies = [
  {
    id: 1,
    assetName: "APEcoin",
    apy: 5.5,
    submitter: "Alice",
  },
  {
    id: 2,
    assetName: "ETH",
    apy: 4.2,
    submitter: "Bob",
  },
  // Add more strategies if needed
];

export default function MainPage() {
  return (
    <>
   <VStack spacing={4} align="stretch">
        <Navbar />
        <StrategiesTable strategies={strategies} />
      </VStack>
    </>
  )
}
