#!/bin/bash
tr '\r' '\n' < .env > .env.unix
source .env


tokenAddress='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
addressSender='0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE'


# issue enough eth to contract deployer and caller
cast rpc anvil_setBalance 0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE 100000000000000000 --rpc-url http://localhost:8545



echo "Deploying on main"
forge script script/Deploy.s.sol:Deploy --fork-url http://localhost:8545  --private-key $PRIVATE_KEY --broadcast -vvvv


# now mint a token, deposit it in the pool and check whether it was successfully dpeosited in our pool and in Aave


# index=''
# value=''


npx slot20 balanceOf 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE 
# `${cast} rpc anvil_setStorageAt "${tokenAddress}" "${index}" "${value}" --rpc-url http://localhost:8545 

