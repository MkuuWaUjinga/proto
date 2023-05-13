import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useBalance, useAccount, useContractWrite } from "wagmi"; // Import wagmi
import {
  assetNameToTokenAdress,
  strategyAddress,
  tokenAddressToAssetName,
} from "../app/util/addresses";
import StrategyRegistry from "../contracts/StrategyRegistry.json";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { Strategy } from "./strategiesTable";

interface DepositModalProps {
  strategy: Strategy;
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  strategy,
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState("");
  const [isValid, setIsValid] = useState(true);
  const toast = useToast();
  const { address, isConnecting, isDisconnected } = useAccount();
  const assetAddress =
    strategy.selectedAsset == 1 ? strategy.asset1 : strategy.asset2;
  const assetName = tokenAddressToAssetName[assetAddress];
  const balance = useBalance({
    address: address,
    token: assetAddress,
  });
  console.log("assetname", balance.data);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (balance.data) {
      if (parseFloat(value) <= parseFloat(balance.data.formatted)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  const handleDepositNow = async () => {
    try {
      const config = await prepareWriteContract({
        address: strategyAddress,
        abi: StrategyRegistry.abi,
        functionName: "deposit",
        args: [assetAddress, amount, strategy.id],
      });
      const tx = await writeContract(config);
      toast({
        title: "Depositing...",
        status: "loading",
        duration: 3000,
        isClosable: true,
      });
      const res = await tx.wait();
      toast({
        title: "Deposit successful",
        description: `${amount} ${assetName} deposited`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Deposit error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit {assetName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>Available: {balance.data?.formatted}</Text>
          <FormControl id="amount" isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              placeholder={`Enter amount of ${assetName}`}
              value={amount}
              onChange={handleChange}
              isInvalid={!isValid}
            />
            {!isValid && (
              <Text color="red.500" fontSize="sm">
                Insufficient balance
              </Text>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleDepositNow}
            isDisabled={!isValid}
          >
            Deposit Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DepositModal;
