const { ethers } = require("ethers");

const index = ethers.utils.solidityKeccak256(
  ["uint256", "uint256"],
  ["0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE", 0] // key, slot
);

console.log("hash", index);
