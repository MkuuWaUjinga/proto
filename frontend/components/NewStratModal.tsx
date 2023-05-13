import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Box,
  useToast,
  Select,
  MenuButton,
  Menu,
  Text,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import { pinFileToIPFS } from "../app/util/ipfs";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { strategyAddress } from "../app/util/addresses";
import StrategyRegistry from "../contracts/StrategyRegistry.json";
import { erc20ABI, useSwitchNetwork } from "wagmi";
import { BigNumber } from "ethers";

interface FormInputs {
  stake: string;
  token1: string;
  token2: string;
  file: FileList;
}

interface NewStratModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<NewStratModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    if (!data.file.length) {
      return alert("Please select a file to upload");
    }
    console.log("switc hn");
    console.log("switc hn done");

    try {
      toast({
        title: "Pushing file to IPFS...",
        status: "loading",
        duration: 3000,
        isClosable: true,
      });

      const ipfsData = await pinFileToIPFS(data.file[0]);

      toast({
        title: "File upload successful",
        description: `IPFS hash: ${ipfsData.IpfsHash}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(true);
      console.log("datwmk", data.token1 as `0x${string}`);
      console.log("i", "d" + strategyAddress + "d");
      let config = await prepareWriteContract({
        address: data.token1 as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [strategyAddress, BigNumber.from("2").pow(256).sub(1)],
      });
      let tx = await writeContract(config);
      toast({
        title: "Giving allowance...",
        status: "loading",
        duration: 3000,
        isClosable: true,
      });
      console.log("bwej");
      console.log("moin", await tx.wait());
      toast({
        title: "Fetched strategist secret and registering strategy...",
        status: "loading",
        duration: 3000,
        isClosable: true,
      });
      console.log("input", [
        ipfsData.IpfsHash,
        data.token1,
        data.token2,
        ethers.utils.parseEther(data.stake).toString(),
        "secret",
      ]);
      let config2 = await prepareWriteContract({
        address: strategyAddress as any,
        abi: StrategyRegistry.abi,
        functionName: "registerStrategy",
        args: [
          ethers.utils.formatBytes32String(ipfsData.IpfsHash.slice(0, 31)),
          data.token1,
          data.token2,
          BigNumber.from(data.stake).toHexString(),
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        ],
      });
      tx = await writeContract(config2);
      await tx.wait();
      toast({
        title: "Successfully registered!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      //upload python
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const tokenOptions = [
    {
      value: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      label: "USDC",
      imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    },
    {
      value: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      label: "Apecoin",
      imageUrl: "https://www.ledger.com/wp-content/uploads/2022/08/18876.png",
    },
    {
      value: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      label: "WETH",
      imageUrl:
        "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png",
    },
  ];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload your model and stake</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box marginTop={"3"}>
                <FormControl
                  isInvalid={errors.stake && errors.stake.message !== ""}
                >
                  <FormLabel>Stake</FormLabel>
                  <Input
                    type="number"
                    {...register("stake", {
                      required: "This field is required",
                    })}
                  />
                </FormControl>
              </Box>
              <Box marginTop={"3"}>
                <FormControl
                  isInvalid={errors.token1 && errors.token1.message !== ""}
                >
                  <FormLabel>Token 1</FormLabel>
                  <Select
                    {...register("token1", {
                      required: "This field is required",
                    })}
                    placeholder="Select a token"
                  >
                    {tokenOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center">
                          {option.label}
                        </Box>
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box marginTop={"3"}>
                <FormControl
                  isInvalid={errors.token2 && errors.token2.message !== ""}
                >
                  <FormLabel>Token 2</FormLabel>
                  <Select
                    {...register("token2", {
                      required: "This field is required",
                    })}
                    placeholder="Select a token"
                  >
                    {tokenOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center">
                          {option.label}
                        </Box>
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box marginTop={"3"}>
                <FormControl
                  isInvalid={errors.file && errors.file.message !== ""}
                >
                  <FormLabel>Python file</FormLabel>
                  <Input
                    type="file"
                    {...register("file", {
                      required: "This field is required",
                    })}
                    variant={"unstyled"}
                  />
                </FormControl>
              </Box>

              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={loading}
              >
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadModal;
