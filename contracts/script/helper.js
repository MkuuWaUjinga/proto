const { ethers } = require("ethers");

const index = ethers.utils.solidityKeccak256(
  ["uint256", "uint256"],
  ["0x876A95383C756588B7C394098D959C9efeFEd625", 9] // key, slot
);

console.log("hash", index);
