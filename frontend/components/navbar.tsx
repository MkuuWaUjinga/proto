"use client"
import * as React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

//import { getCryptoPrice } from "../utils/getPrices";

import { Web3Button } from "@web3modal/react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      boxShadow="md"
    >
      <Flex align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold">
          X2
        </Text>
      </Flex>

      <Flex
        as="nav"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <Box display={{ base: "none", md: "flex" }} alignItems="center">
          {/* Swap Menu */}
          <Link
            as={Link}
            textDecoration="none"
            color={textColor}
            padding="0.5rem"
          >
            Swap
          </Link>
          <Link
            as={Link}
            textDecoration="none"
            color={textColor}
            padding="0.5rem"
          >
            Tokens
          </Link>
        </Box>
      </Flex>

      <Box display="flex" alignItems="center">
        {/* Dark Mode Toggle Button */}
        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Toggle dark mode"
          onClick={toggleColorMode}
          mr={2} // Add marginRight to create some space between the buttons
        />

        {/* Connect Wallet Button */}
        {/* <Button colorScheme="blue" variant="outline" onClick={() => console.log('Connect Wallet')}>
          Connect Wallet
        </Button> */}
        <Web3Button />
      </Box>
    </Flex>
  );
};

export default Navbar;