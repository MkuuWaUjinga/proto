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
import { useBalance, useAccount } from "wagmi"; // Import wagmi

interface DepositModalProps {
  strategy: any;
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  strategy,
  isOpen,
  onClose,
}) => {
  const assetNameToTokenAdress = {
    ETH: null,
    APEcoin: "0x4d224452801ACEd8B2F0aebE155379bb5D594381", // todo fix balance retrieval for tokens. currently throws ContractMethodNoResultError
  };
  const [amount, setAmount] = useState("");
  const [isValid, setIsValid] = useState(true);
  const toast = useToast();
  const { address, isConnecting, isDisconnected } = useAccount();
  const balance = useBalance({ address: address, token: assetNameToTokenAdress[strategy.assetName] });
  const withdrawFunds = async (assetName: string, amount: number) => {
    // TODO - use wagmi to withdraw funds
    return true;
  };

  
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
      await withdrawFunds(strategy.assetName, parseFloat(amount));
      toast({
        title: "Deposit successful",
        description: `${amount} ${strategy.assetName} deposited`,
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
        <ModalHeader>Deposit {strategy.assetName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Available:  {balance.data?.formatted} 
            </Text>
          <FormControl id="amount" isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              placeholder={`Enter amount of ${strategy.assetName}`}
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
