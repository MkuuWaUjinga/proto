const { ethers } = require("ethers");

const index = ethers.utils.solidityKeccak256(
  ["uint256", "uint256"],
  ["0x9b9e6e9c0c3578cad98321efb4e0651a507536ce", 9] // key, slot
);

console.log("hash", index);
