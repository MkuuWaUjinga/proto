// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./Deposit.sol";

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

    // mapping from asset id to the deposit module
    mapping(address => address) depositModules;

    // Block numbers per epoch
    uint256 public constant BLOCKS_PER_EPOCH = 5000; // This value is an example and will depend on your use case

    // Uniswap v3 Nonfungible Position Manager
    INonfungiblePositionManager public positionManager;

    // Uniswap v3 Swap Router
    ISwapRouter public swapRouter;


    // each asset has one strategy registry
    constructor(IERC20 _stakingToken, INonfungiblePositionManager _positionManager, ISwapRouter _swapRouter, DepositModule _depositModule) {
        stakingToken = _stakingToken;
        positionManager = _positionManager;
        swapRouter = _swapRouter;
        depositModule = _depositModule;
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

    function runStrategy(uint256 strategyID) external {
        Strategy memory strategy = strategies[strategyID];
        require(msg.sender == strategy.creator, "Only the creator can run this strategy.");

        // Add check to ensure that only strategies within the correct epoch can be run...

        // Create a range order on Uniswap v3
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: address(stakingToken),
            token1: strategy.asset,
            fee: 3000, // This will depend on your use case
            tickLower: -887220, // This will depend on your use case
            tickUpper: 887220, // This will depend on your use case
            amount0Desired: strategy.stake,
            amount1Desired: 0,
            amount0Min: strategy.stake,
            amount1Min: 0,
            recipient: address(this),
            deadline: block.timestamp + 15 minutes
        });

        // Transfer the required tokens to the Position Manager
        stakingToken.approve(address(positionManager), strategy.stake);

        // Mint the position
        positionManager.mint(params);
    }

    function updateRange(uint256 tokenId, int24 newTickLower, int24 newTickUpper) external {
        // Collect the maximum amount of tokens from the position
        positionManager.collect({
            tokenId: tokenId,
            recipient: msg.sender,
            amount0Max: type(uint128).max,
            amount1Max: type(uint128).max
        });

        // Burn the NFT representing the position
        positionManager.burn(tokenId);

        // Add liquidity to the new range
        positionManager.mint({
            token0: token0,
            token1: token1,
            fee: fee,
            tickLower: newTickLower,
            tickUpper: newTickUpper,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes
        });
    }   


}
