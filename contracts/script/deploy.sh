#!/bin/bash
tr '\r' '\n' < .env > .env.unix
source .env


echo "Deploying on main"
export CHAINID=1
#forge script script/deployModules.s.sol:DeployMasterChain --ffi --rpc-url $MOONBASE_RPC_URL  --private-key $PRIVATE_KEY --broadcast -vvvv 
forge script script/Deploy.s.sol:Deploy --fork-url http://localhost:8545  --private-key $PRIVATE_KEY --broadcast -vvvv
