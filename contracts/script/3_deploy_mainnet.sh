
source .env

forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_GNOSIS_CHAIN  --private-key $PRIVATE_KEY_USER --broadcast -vvvv
