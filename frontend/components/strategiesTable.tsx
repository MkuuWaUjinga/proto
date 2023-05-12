"use client"
import React, {useState} from "react";
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
} from "@chakra-ui/react";
import DepositModal from "./depositModal";

interface Strategy {
  id: number;
  assetName: string;
  apy: number;
  submitter: string;
}

interface StrategiesTableProps {
  strategies: Strategy[];
}

const StrategiesTable: React.FC<StrategiesTableProps> = ({ strategies }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const handleDepositClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    onOpen();
  };

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Strategy ID</Th>
            <Th>Asset Name</Th>
            <Th>APY</Th>
            <Th>Submitter</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {strategies.map((strategy) => (
            <Tr key={strategy.id}>
              <Td>{strategy.id}</Td>
              <Td>{strategy.assetName}</Td>
              <Td>{strategy.apy.toFixed(2)}%</Td>
              <Td>{strategy.submitter}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => handleDepositClick(strategy)}
                >
                  Deposit
                </Button>
              </Td>
            </Tr>
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
    </Box>
  );
};

export default StrategiesTable;