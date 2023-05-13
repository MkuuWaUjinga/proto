#!/bin/bash
#tr '\r' '\n' < .env > .env.unix
source .env

deployedStrategist=0x4Da8eF64Aa62405F8Fd294A32328042A0838c688


# 
#cast rpc anvil_setStorageAt 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 $(cast keccak "[0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE,9]") 0x000000000000000000000000000000000000000000000000000000174876e800 --rpc-url http://localhost:8545 



# set allowance for the token to deposit it into the pool


# register the strategy first before depositing and give allowance to put up stake before
#cast --format-bytes32-string "hello"
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY_STRATEGIST $addressUSDC "approve(address,uint256)" $deployedStrategist 1000000
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY_STRATEGIST $deployedStrategist "registerStrategy(bytes32,address,address,uint256,address)" 0x68656c6c6f000000000000000000000000000000000000000000000000000000 $addressUSDC $addressUSDC 1000 0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE
# cast call $addressUSDC "balanceOf(address)(uint256)" $ADDRESS_STRATEGIST --rpc-url http://localhost:8545 

cast call --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY_USER $addressUSDC "approve(address,uint256)" $deployedStrategist 1000000

# #allownace+deposit and withdraw funds and check that funds are 0 eventually
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY_USER $addressUSDC "approve(address,uint256)" $deployedStrategist 1000000
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY_USER $deployedStrategist "deposit(uint8,uint16,uint256)" 1 1000 0
# #cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY $deployedStrategist "withdraw(address,uint256,uint256)" $addressUSDC 1000 0

# # check aToken balance for usdc
cast call 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c "balanceOf(address)(uint256)" $deployedStrategist --rpc-url http://localhost:8545


#cast call 0x0B3b0376e52fBD02892878C7792D63b30D4Ac76B "getStrategies()"  --rpc-url http://localhost:8545

