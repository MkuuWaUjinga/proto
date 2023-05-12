// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StrategyRegistry {
    
    // Strategy struct
    struct Strategy {
        uint256 strategyID;
        bytes32 hash;
        address asset;
        uint256 startEpoch;
        uint256 endEpoch;
        uint256 stake;
        address creator;
        uint256 lastExecuted;
    }

    // Array of all strategies
    uint256[]  strategiesID;

    // Mapping from strategy ID to strategy
    mapping(uint256 => Strategy) strategies;

    // Block numbers per epoch
    uint256 public constant BLOCKS_PER_EPOCH = 5000; // This value is an example and will depend on your use case

    constructor(IERC20 _stakingToken) {
        stakingToken = _stakingToken;
    }

    function registerStrategy(bytes32 hash, address asset, uint256 startBlock, uint256 endBlock, uint256 stake) external {
        require(startBlock <= endBlock, "Invalid block range.");

        // Transfer the stake from the user to this contract
        IERC20(asset).transferFrom(msg.sender, address(this), stake);

        // Calculate the start and end epochs
        uint256 startEpoch = startBlock / BLOCKS_PER_EPOCH;
        uint256 endEpoch = endBlock / BLOCKS_PER_EPOCH;

        // Create the new strategy
        Strategy memory newStrategy = Strategy({
            strategyID: _strategies.length,
            hash: hash,
            asset: asset,
            startEpoch: startEpoch,
            endEpoch: endEpoch,
            stake: stake,
            creator: msg.sender
        });

        // Add the new strategy to the list of strategies
        strategiesID.push(newStrategy.strategyID);

        // Add the new strategy to the mapping
        strategies[newStrategy.strategyID] = newStrategy;
    }

    function getStrategies() external view returns (Strategy[] memory) {
        return _strategies;
    }

    function getStrategyByID(uint256 strategyID) external view returns (Strategy memory) {
        return _strategyByID[strategyID];
    }
}
