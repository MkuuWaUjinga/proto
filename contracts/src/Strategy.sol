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
        uint256 stake;
        uint256 maxAllowedStrategyUse;
        address creator;
        address public_share_secret;
        uint256 lastExecuted;
        uint256 capitalAllocated;
    }

    // Mapping from strategy ID
    mapping(uint256 => mapping(address => uint256)) strategyBalances;
    mapping(uint256 => mapping(address => bool)) strategyRegisteredNodeRunner;


    // Array of all strategies
    uint256[] strategiesID;

    // Mapping from strategy ID to strategy
    mapping(uint256 => Strategy) strategies;


    // Block numbers per epoch
    // uint256 public constant BLOCKS_PER_EPOCH = 5000; // This value is an example and will depend on your use case

    // Aave stuff
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    address public aToken = 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c;
    IPool public pool = IPool(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);

    // tracking of strategy => user => balance
    //mapping(address => mapping(address => uint256)) balancesVault;

    // tracking of strategists funds usage
    // track everything that was deposited and withdrawn by a strategist
    // mapping(address => uint256) public strategyFundsUsed;
    // mapping(address => uint256) public strategyFundsUsed;




    // Uniswap v3 Nonfungible Position Manager
    address public positionManager;
    // Uniswap v3 Swap Router
    address public swapRouter;
    address public stakingToken;


    // each asset has one strategy registry
    constructor(address _stakingToken, address _positionManager, address _swapRouter) {
        stakingToken = _stakingToken;
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

    function deposit(address token, uint16 amount, uint256 strategyID) external {
        Strategy storage strategy = strategies[strategyID];
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // // Approve Aave Lending Pool to use the tokens
        // IERC20(token).approve(address(pool), amount);
        // pool.deposit(token, amount, address(this), amount);
        // strategy.capitalAllocated+=amount;
        // strategyBalances[strategyID][msg.sender] += amount;
    }

    // function deposit(uint256 strategyID, address token, uint256 amount) external {
    //     // Transfer the tokens to this contract
    //     IERC20(token).transferFrom(msg.sender, address(this), amount);

    //     // // Approve Aave Lending Pool to use the tokens
    //     IERC20(token).approve(address(pool), amount);

    //     //IPoolAddressesProvider provider = IPoolAddressesProvider(address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)); 
    //     //IPool lendingPool = IPool(provider.getPool());
    //     //console2.log(address(lendingPool));
    //     console2.log(address(pool));
    //     // // Deposit the tokens into the Aave Lending Pool
    //     pool.deposit(token, amount, address(this), 1000);

    //     // // Update the balance
    //     balancesVault[token][msg.sender] += amount;
    // }

    function withdraw(address token, uint256 amount, uint256 strategyID) external{
        Strategy storage strategy = strategies[strategyID];
        require(strategyBalances[strategyID][msg.sender] >= amount, "Insufficient balance");
        strategyBalances[strategyID][msg.sender] -= amount;
        strategy.capitalAllocated-=amount;
        pool.withdraw(token, amount, msg.sender);
    }


    // function withdraw(address token, uint256 amount) external {
    //     // Update the balance
    //     _balances[msg.sender] -= amount;
        
    //     // Withdraw the tokens from the Aave Lending Pool
    //     //IPool(_getLendingPool()).withdraw(token, amount, msg.sender);
    // }



    // // function that enables the a whitelised user to withdraw funds from the pool
    // function withdrawStrategist(address strategy, address token, uint256 amount) onlyWhitelistedStrategist external {
    //     // Update the balance
    //     strategyFundsUsed[strategy] += amount;
    //     pool.withdraw(token, amount, address(strategyContract));

    //     // Withdraw the tokens from the Aave Lending Pool
    //     //IPool(_getLendingPool()).withdraw(token, amount, msg.sender);
    // }


    // // deposit strategist 
    // function depositStrategist(address strategist, address token, uint256 amount) onlyWhitelistedStrategist external {
        

    //     strategistFundsUsed[strategist] -= amount;
    //     pool.withdraw(token, amount, address(strategyContract));
    //     // Transfer the tokens to this contract
    //     IERC20(token).transferFrom(msg.sender, address(this), amount);

    //     // // Approve Aave Lending Pool to use the tokens
    //     IERC20(token).approve(address(pool), amount);
    //     pool.deposit(token, amount, address(this), 1000);

    //     // // Update the balance
    //     strategistFundsUsed[msg.sender] += amount;
    // }


    // USE FUNDS FROM VAULTS IN MARKET MAKING ACTIVITY


    function registerStrategy(bytes32 hash, address asset1, uint256 stake, address public_share_secret) external {
        // require(startBlock <= endBlock, "Invalid block range.");

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
            stake: stake,
            maxAllowedStrategyUse: 0,// TODO check
            creator: msg.sender,
            public_share_secret: public_share_secret,
            lastExecuted: 0,
            capitalAllocated: 0
        });

        // Add the new strategy to the list of strategies
        strategiesID.push(newStrategy.strategyID);

        // Add the new strategy to the mapping
        strategies[newStrategy.strategyID] = newStrategy;
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

    function runStrategy(uint256 nodeRunnerID, uint256 strategyID, int24 tickLower, int24 tickUpper, uint256 portionOfFunds0, uint256 portionOfFunds1) external {
        Strategy memory strategy = strategies[strategyID];
        require(msg.sender == strategy.creator, "Only the creator can run this strategy.");

        // Add check to ensure that only strategies within the correct epoch can be run...
        // potentially do approve here?? @Alex to fix
        // Create a range order on Uniswap v3
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: strategy.asset1,
            token1: strategy.asset1,
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
