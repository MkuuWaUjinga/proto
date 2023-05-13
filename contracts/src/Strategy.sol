// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "aave-v3-core/contracts/interfaces/IPool.sol";
import "aave-v3-core/contracts/interfaces/IPoolAddressesProvider.sol";


import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "v3-periphery/interfaces/INonfungiblePositionManager.sol";
import "v3-periphery/interfaces/ISwapRouter.sol";
// import "./Deposit.sol";
import {console2} from "lib/forge-std/src/console2.sol";


contract StrategyRegistry {
    
    // Strategy struct
    struct Strategy {
        uint256 strategyID;
        bytes32 hash;
        address asset1;
        address asset2;
        uint256 stake;
        uint256 maxAllowedStrategyUse;
        address creator;
        address public_share_secret;
        uint256 lastExecuted;
        uint256 capitalDeposited1;
        uint256 capitalDeposited2;
        uint256 capitalAllocated1;
        uint256 capitalAllocated2;

    }

    // Mapping from strategy => user => token => balance
    mapping(uint256 => mapping(address => mapping(address => uint256))) strategyBalances;
    mapping(uint256 => mapping(address => bool)) strategyRegisteredNodeRunner;


    // Array of all strategies
    uint256[] strategiesID;

    // Mapping from strategy ID to strategy
    mapping(uint256 => Strategy) strategies;


    // Aave stuff
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    address public aToken = 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c;
    IPool public pool = IPool(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);


    // Uniswap v3 Nonfungible Position Manager
    address public positionManager;
    // Uniswap v3 Swap Router
    address public swapRouter;
    address public stakingToken;


    // each asset has one strategy registry
    constructor(address _positionManager, address _swapRouter) {
        positionManager = _positionManager;
        swapRouter = _swapRouter;
    }

    // function that returns an array of all strategy structs
    function getStrategies() external view returns (Strategy[] memory) {
        Strategy[] memory _strategies = new Strategy[](strategiesID.length);
        for (uint256 i = 0; i < strategiesID.length; i++) {
            _strategies[i] = strategies[strategiesID[i]];
        }
        return _strategies;
    }


    // functions to manage the funds in vaults

    function deposit(uint8 asset, uint16 amount, uint256 strategyID) external {
        Strategy storage strategy = strategies[strategyID];
        address token;
        if (asset==1){
            token = strategy.asset1;
            strategy.capitalDeposited1+=amount;
        }
        else{
            token = strategy.asset2;
            strategy.capitalDeposited2+=amount;
        }
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // // Approve Aave Lending Pool to use the tokens
        IERC20(token).approve(address(pool), amount);
        pool.deposit(token, amount, address(this), amount);
        strategiesID.push(strategyID);
        strategyBalances[strategyID][msg.sender][token] += amount;
    }


    function withdraw(uint8 asset, uint16 amount, uint256 strategyID) external{
        Strategy storage strategy = strategies[strategyID];
        address token;
        if (asset==1){
            token = strategy.asset1;
            strategy.capitalDeposited1-=amount;
        }
        else{
            token = strategy.asset2;
            strategy.capitalDeposited2-=amount;
        }
    // Mapping from strategy => user => token => balance

        require(strategyBalances[strategyID][msg.sender][token] >= amount, "Insufficient balance");
        strategyBalances[strategyID][msg.sender][token] -= amount;
        pool.withdraw(token, amount, address(this));
    }


    // USE FUNDS FROM VAULTS IN MARKET MAKING ACTIVITY


    function registerStrategy(bytes32 hash, address asset1, address asset2, uint256 stake, address public_share_secret) external {
        // require(startBlock <= endBlock, "Invalid block range.");

        // Transfer the stake from the user to this contract
        require(IERC20(asset1).transferFrom(msg.sender, address(this), stake));

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
            maxAllowedStrategyUse: 0,// TODO check
            creator: msg.sender,
            public_share_secret: public_share_secret,
            lastExecuted: 0,
            capitalDeposited1: 0,
            capitalDeposited2: 0,
            capitalAllocated1: 0,
            capitalAllocated2: 0
        });

        // Add the new strategy to the mapping
        strategies[strategiesID.length] = newStrategy;
        strategiesID.push(newStrategy.strategyID);

    }

    function registerNodeRunner(uint256 strategyID, uint8 v, bytes32 r, bytes32 s) external{
            // TODO 
            // address signer = ecrecover(ethSignedMessageHash, v, r, s);
            // require(signer == msg.sender, "Invalid signature.")
            Strategy storage strategy = strategies[strategyID];
            strategyRegisteredNodeRunner[strategyID][msg.sender] = true;
    }
    // // whitelist strategist function that can be only changed by the owner of this contract
    // function whitelistStrategist(uint256 strategyID) external {
    //     require(msg.sender == owner || msg.sender == strategyContract , "Only the owner can whitelist a strategist.");
    //     _whitelistedStrategies.push(strategy);
    // }



    function getStrategyByID(uint256 strategyID) external view returns (Strategy memory) {
        return strategies[strategyID];
    }

    uint256 univ3TokenId = 0;

    function runStrategy(uint256 strategyID, int24 minTick, int24 maxTick, uint256 amount0Desired, uint256 amount1Desired) external {
        Strategy memory strategy = strategies[strategyID];
        require(strategyRegisteredNodeRunner[strategyID][msg.sender], "pls register node to run this strategy.");

        if(univ3TokenId != 0){
            
            // // collect fees
            // INonfungiblePositionManager.CollectParams memory params1 = INonfungiblePositionManager.CollectParams({
            //     tokenId: univ3Position,
            //     recipient: address(this),  // Address to receive fees
            //     amount0Max: type(uint128).max, // Max amount of token0 to collect
            //     amount1Max: type(uint128).max  // Max amount of token1 to collect
            //     }); 
            // positionManager.collect(params1);

            // //remove liquidity
            // INonfungiblePositionManager.DecreaseLiquidityParams memory params2 = INonfungiblePositionManager.DecreaseLiquidityParams({
            //     tokenId: univ3Position,
            //     liquidity: type(uint128).max,  // Decrease all liquidity
            //     amount0Min: 0,  // We don't place any limit on the amount of tokens received
            //     amount1Min: 0,
            //     deadline: block.timestamp + 15 minutes
            // });

            // positionManager.decreaseLiquidity(params2);

            // // burn position
            // positionManager.burn(univ3Position);
            univ3TokenId = 0;
        }

        // int24 MIN_TICK = -887272;
        // int24 MAX_TICK = -MIN_TICK;
        int24 TICK_SPACING = 60;


        // withdraw funds from aave, approve them for poition manager and deposit them in uniswap
        strategy.capitalAllocated1+=amount0Desired;
        strategy.capitalAllocated2+=amount1Desired;

        pool.withdraw(strategy.asset1, amount0Desired, address(this));
        pool.withdraw(strategy.asset2, amount1Desired, address(this));


        IERC20(strategy.asset1).approve(address(positionManager), amount0Desired);
        IERC20(strategy.asset2).approve(address(positionManager), amount1Desired);

        // Add check to ensure that only strategies within the correct epoch can be run...
        // potentially do approve here?? @Alex to fix
        // Create a range order on Uniswap v3
        INonfungiblePositionManager.MintParams memory params3 = INonfungiblePositionManager.MintParams({
            token0: strategy.asset1,
            token1: strategy.asset2,
            fee: 3000, // This will depend on your use case
            tickLower: (minTick / TICK_SPACING) * TICK_SPACING,
            tickUpper: (maxTick / TICK_SPACING) * TICK_SPACING,
            amount0Desired: amount0Desired,//(portionOfFunds0 * strategy.capitalAllocated1) / 10**18,
            amount1Desired: amount1Desired,//(portionOfFunds1 * strategy.capitalAllocated1) / 10**18,
            amount0Min: 0,
            amount1Min: 0,
            recipient: address(this),
            deadline: block.timestamp + 15 minutes
        });

        // // Transfer the required tokens to the Position Manager
        // IERC20(stakingToken).approve(address(positionManager), strategy.stake);

        // Mint the position
        // INonfungiblePositionManager(positionManager).mint(params);
        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = INonfungiblePositionManager(positionManager).mint(params3);

        univ3TokenId = tokenId;
    }

}
