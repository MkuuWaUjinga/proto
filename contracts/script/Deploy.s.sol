// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "forge-std/Script.sol";
import "../src/Strategy.sol";
import "../src/Deposit.sol";
import {console2} from "lib/forge-std/src/console2.sol";



contract Deploy is Script {
    function run() external {

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_USER");

        // address token = address(0);

        address uniPositionManager = address(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
        address uniSwapRouter = address(0);


        vm.startBroadcast(deployerPrivateKey);

        //DepositModule depositModule = new DepositModule();
        StrategyRegistry strategyRegistry = new StrategyRegistry(uniPositionManager, uniSwapRouter);


        console2.logAddress(address(strategyRegistry));
        vm.stopBroadcast();
    }
}
