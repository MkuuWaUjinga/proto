"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Button,
  IconButton,
  Icon,
  Text,
} from "@chakra-ui/react";
import DepositModal from "./depositModal";
import { AddIcon } from "@chakra-ui/icons";
import NewStratModal from "./NewStratModal";
import {
  strategyAddress,
  tokenAddressToAssetName,
} from "../app/util/addresses";
import { useContractRead } from "wagmi";
import StrategyRegistry from "../contracts/StrategyRegistry.json";
import { BigNumber, ethers } from "ethers";
// import { ethers } from "ethers";

export interface Strategy {
  id: number;
  hash: string;
  asset1: string;
  asset2: string;
  stake: string;
  maxAllowedStrategyUse: number;
  creator: string;
  public_share_secret: string;
  lastExecuted: number;
  capitalAllocated1: number;
  capitalAllocated2: number;
  selectedAsset?: number;
}

const StrategiesTable: React.FC = () => {
  const [strategies, setStrategies] = useState([] as Strategy[]);
  async function loadStrategies() {
    const contract = new ethers.Contract(
      strategyAddress,
      StrategyRegistry.abi,
      new ethers.providers.JsonRpcProvider("http://localhost:8545")
    );
    const tx1 = await contract.getStrategies();
    console.log("txt1", tx1);
    console.log(
      tx1.map((strategy: any) => {
        return {
          id: strategy.id,
          hash: strategy.hash,
          asset1: strategy.asset1,
          asset2: strategy.asset2,
          stake: strategy.stake,
          maxAllowedStrategyUse: strategy.maxAllowedStrategyUse,
          creator: strategy.creator,
          public_share_secret: strategy.public_share_secret,
          lastExecuted: strategy.lastExecuted,
          capitalAllocated1: ethers.utils.formatEther(
            BigNumber.from(strategy.capitalDeposited1).toString()
          ),
          capitalAllocated2: ethers.utils.formatEther(
            BigNumber.from(strategy.capitalDeposited2).toString()
          ),
          selectedAsset: strategy.selectedAsset,
        };
      })
    );
    setStrategies(
      tx1.map((strategy: any) => {
        return {
          id: BigNumber.from(strategy.strategyID).toString(),
          hash: strategy.hash,
          asset1: strategy.asset1,
          asset2: strategy.asset2,
          stake: strategy.stake,
          maxAllowedStrategyUse: strategy.maxAllowedStrategyUse,
          creator: strategy.creator,
          public_share_secret: strategy.public_share_secret,
          lastExecuted: strategy.lastExecuted,
          capitalAllocated1: BigNumber.from(
            strategy.capitalDeposited1
          ).toString(),
          capitalAllocated2: BigNumber.from(
            strategy.capitalDeposited2
          ).toString(),
          selectedAsset: strategy.selectedAsset,
        };
      })
    );
  }
  useEffect(() => {
    loadStrategies();
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const createStartModal = useDisclosure();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );
  console.log("strat", strategies);
  const handleDepositClick = (strategy: Strategy, asset: 1 | 2) => {
    setSelectedStrategy({ ...strategy, selectedAsset: asset });
    onOpen();
  };

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Strategy ID</Th>
            <Th>Asset Name</Th>
            <Th>Allocated Capital</Th>
            <Th>APY</Th>
            <Th>Submitter</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {strategies.map((strategy) => (
            <>
              <Tr key={strategy.id}>
                <Td>{strategy.id}</Td>
                <Td>
                  {tokenAddressToAssetName[strategy.asset1.toLowerCase()]}
                </Td>
                <Td>{strategy.capitalAllocated1}</Td>
                <Td>Not enough historical data</Td>
                <Td>{strategy.creator}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleDepositClick(strategy, 1)}
                  >
                    Deposit
                  </Button>
                </Td>
              </Tr>
              <Tr key={strategy.id}>
                <Td>{strategy.id}</Td>
                <Td>
                  {tokenAddressToAssetName[strategy.asset2.toLowerCase()]}
                </Td>
                <Td>{strategy.capitalAllocated2}</Td>
                <Td>Not enough historical data</Td>
                <Td>{strategy.creator}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleDepositClick(strategy, 2)}
                  >
                    Deposit
                  </Button>
                </Td>
              </Tr>
            </>
          ))}
        </Tbody>
      </Table>
      {selectedStrategy && (
        <DepositModal
          strategy={selectedStrategy}
          isOpen={isOpen}
          onClose={() => {
            setSelectedStrategy(null);
            onClose();
          }}
        />
      )}
      <Box justifyContent={"center"} display={"flex"} m={"5"}>
        <Button
          leftIcon={<AddIcon />}
          variant="solid"
          onClick={createStartModal.onOpen}
        >
          Add new strategy
        </Button>
      </Box>
      <NewStratModal
        isOpen={createStartModal.isOpen}
        onClose={createStartModal.onClose}
      />
    </Box>
  );
};

export default StrategiesTable;
