#!/bin/bash
#tr '\r' '\n' < .env > .env.unix
source .env



# issue enough eth to contract deployer and caller
cast rpc anvil_setBalance 0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE 100000000000000000 --rpc-url http://localhost:8545



echo "Deploying on main"
forge script script/Deploy.s.sol:Deploy --fork-url http://localhost:8545  --private-key $PRIVATE_KEY --broadcast -vvvv


# ensure the user has enough funds in USDC to deposit


# index=''
# value=''

#
npx slot20 balanceOf 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 0x4e0bA53A8BD472424BF304DC84503a9c526bF0A4 --rpc http://localhost:8545

# call helper js file to get the set storage index (address and storage slot)
cast rpc anvil_setStorageAt $addressUSDC 0xe20dc22a889b2c795aab50671126cbb6c18e878e6939dab00ccff747ccb41ac0 0x000000000000000000000000000000000000000000000000000000174876e800 --rpc-url http://localhost:8545 
cast call $addressUSDC "balanceOf(address)(uint256)" $addressSender --rpc-url http://localhost:8545 