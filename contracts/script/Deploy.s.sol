// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Strategy.sol";
import "../src/Deposit.sol";


contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address token = "";

        address uniPositionManager = '';
        address uniSwapRouter = '';


        vm.startBroadcast(deployerPrivateKey);

        DepositModule depositModule = new DepositModule();
        StrategyRegistry strategyRegistry = new StrategyRegistry(token, uniPositionManager, uniSwapRouter, depositModule);

        vm.stopBroadcast();
    }
}
