#!/bin/bash
#tr '\r' '\n' < .env > .env.unix
source .env

deployedStrategist=0x52485A07D8717709FD2578C15Fdc8cb5e0B1e50f
deployedDeposit=0xAE50CCbD0B6893858Ce5B956B8Ca7178D26A2aF1

# 
#cast rpc anvil_setStorageAt 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 $(cast keccak "[0x9b9E6E9c0C3578cAD98321eFb4e0651A507536CE,9]") 0x000000000000000000000000000000000000000000000000000000174876e800 --rpc-url http://localhost:8545 



# set allowance for the token to deposit it into the pool
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY $addressUSDC "approve(address,uint256)" $deployedDeposit 1000 

#deposit funds locally in the pool
cast send --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY $deployedDeposit "deposit(address,uint256)" $addressUSDC 1000 


