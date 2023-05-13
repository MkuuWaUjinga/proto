// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "v3-periphery/interfaces/INonfungiblePositionManager.sol";
import "v3-periphery/interfaces/ISwapRouter.sol";
import "./Deposit.sol";

contract StrategyRegistry {
    
    // Strategy struct
    struct Strategy {
        uint256 strategyID;
        bytes32 hash;
        address asset1;
        address asset2;
        uint256 stake;
        address creator;
        uint256 lastExecuted;
        uint256 capitalAllocated;
        mapping(address => uint256) balances;
    }

    // Array of all strategies
    uint256[] strategiesID;

    // Mapping from strategy ID to strategy
    mapping(uint256 => Strategy) strategies;

    // Block numbers per epoch
    // uint256 public constant BLOCKS_PER_EPOCH = 5000; // This value is an example and will depend on your use case

    // Uniswap v3 Nonfungible Position Manager
    address public positionManager;

    // Uniswap v3 Swap Router
    address public swapRouter;

    DepositModule public depositModule;

    address public stakingToken;


    // each asset has one strategy registry
    constructor(address _stakingToken, address _positionManager, address _swapRouter, DepositModule _depositModule) {
        stakingToken = _stakingToken;
        positionManager = _positionManager;
        swapRouter = _swapRouter;
        depositModule = _depositModule;
    }

    function allocateFunds(address token, uint256 amount, uint256 strategyID){
        Strategy storage strategy = strategies[strategyID];
        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        depositModule.deposit(token,amount);
        strategy.capitalAllocated+=amount;
        strategy.balances[msg.sender] += amount;
    }

    function withdrawFunds(address token, uint256 amount, uint256 strategyID){
        Strategy storage strategy = strategies[strategyID];
        require(strategy.balances[msg.sender] >= amount, "Insufficient balance");
        strategy.balances[msg.sender] -= amount;
        strategy.capitalAllocated-=amount;
        depositModule.withdraw(token,amount);
    }

    function registerStrategy(bytes32 hash, address asset1, address asset2, uint256 stake) external {
        require(startBlock <= endBlock, "Invalid block range.");

        // Transfer the stake from the user to this contract
        IERC20(asset1).transferFrom(msg.sender, address(this), stake);

        // Calculate the start and end epochs
        // uint256 startEpoch = startBlock / BLOCKS_PER_EPOCH;
        // uint256 endEpoch = endBlock / BLOCKS_PER_EPOCH;

        // Create the new strategy
        Strategy memory newStrategy = Strategy({
            strategyID: strategiesID.length,
            hash: hash,
            asset1: asset1,
            asset2: asset2,
            stake: stake,
            creator: msg.sender,
            lastExecuted: 0
        });

        // Add the new strategy to the list of strategies
        strategiesID.push(newStrategy.strategyID);

        // Add the new strategy to the mapping
        strategies[newStrategy.strategyID] = newStrategy;
    }

    function getStrategies() external view returns (uint256[] memory) {
        return strategiesID;
    }

    function getStrategyByID(uint256 strategyID) external view returns (Strategy memory) {
        return strategies[strategyID];
    }

    function runStrategy(uint256 nodeRunnerID, uint256 strategyID, uint256 tickLower, uint256 tickUpper, uint256 portionOfFunds0, uint256 portionOfFunds1) external {
        Strategy memory strategy = strategies[strategyID];
        require(msg.sender == strategy.creator, "Only the creator can run this strategy.");

        // Add check to ensure that only strategies within the correct epoch can be run...
        // potentially do approve here?? @Alex to fix
        // Create a range order on Uniswap v3
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: strategy.asset1,
            token1: strategy.asset2,
            fee: 3000, // This will depend on your use case
            tickLower: tickLower, // This will depend on your use case
            tickUpper: tickUpper, // This will depend on your use case
            amount0Desired: (portionOfFunds0 * strategy.capitalAllocated) / 10**18,
            amount1Desired: (portionOfFunds1 * strategy.capitalAllocated) / 10**18,
            amount0Min: 0,
            amount1Min: 0,
            recipient: address(this),
            deadline: block.timestamp + 15 minutes
        });

        // Transfer the required tokens to the Position Manager
        IERC20(stakingToken).approve(address(positionManager), strategy.stake);

        // Mint the position
        INonfungiblePositionManager(positionManager).mint(params);
    }



    // function updateRange(uint256 tokenId, int24 newTickLower, int24 newTickUpper) external {
    //     // Collect the maximum amount of tokens from the position
    //     positionManager.collect({
    //         tokenId: tokenId,
    //         recipient: msg.sender,
    //         amount0Max: type(uint128).max,
    //         amount1Max: type(uint128).max
    //     });

    //     // Burn the NFT representing the position
    //     positionManager.burn(tokenId);

    //     // Add liquidity to the new range
    //     positionManager.mint({
    //         token0: token0,
    //         token1: token1,
    //         fee: fee,
    //         tickLower: newTickLower,
    //         tickUpper: newTickUpper,
    //         amount0Desired: amount0Desired,
    //         amount1Desired: amount1Desired,
    //         amount0Min: amount0Min,
    //         amount1Min: amount1Min,
    //         recipient: msg.sender,
    //         deadline: block.timestamp + 15 minutes
    //     });
    // }   
}
