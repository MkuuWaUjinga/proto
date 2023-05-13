// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

// //import "aave-v3-core/contracts/interfaces/IAToken.sol";

// import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
// import "aave-v3-core/contracts/interfaces/IPool.sol";
// import "aave-v3-core/contracts/interfaces/IPoolAddressesProvider.sol";
// // import IAaveLendingPool
// import "aave-v3-core/contracts/interfaces/IPool.sol";
// // import console2
// import {console2} from "lib/forge-std/src/console2.sol";


// contract DepositModule {

//     // Aave V3 Lending Pool Addresses Provider address
//     address private constant LENDING_POOL_ADDRESSES_PROVIDER = address(0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e); // Replace with the correct address

//     // Mapping from token address to mapping of account balances
//     mapping(address => uint256) private _balances;

//     // all for usdc
//     IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
//     address public aToken = 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c;
//     IPool public pool = IPool(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);

//     address [] _whitelistedStrategies;

//     // mapping that stores for every strategist the amounts of funds used
//     mapping(address => uint256) public strategistFundsUsed;

//     address owner;
//     address strategyContract;
    


//     // modifier that checks whether calller is whitelsited
//     modifier onlyWhitelistedStrategist() {
//         bool isWhitelisted = false;
//         for (uint i = 0; i < _whitelistedStrategists.length; i++) {
//             if (_whitelistedStrategists[i] == msg.sender) {
//                 isWhitelisted = true;
//             }
//         }
//         require(isWhitelisted, "Only whitelisted strategist can call this function.");
//         _;
//     }


//     // constructor that sets owner
//     constructor() {
//         // Approve Aave Lending Pool to use the tokens
//         owner = msg.sender;
//         }

//     // register strategy contract
//     function registerStrategyContract(address _strategyContract) external {
//         require(msg.sender == owner, "Only owner can register strategy contract.");
//         strategyContract = _strategyContract;
//     }


//     function balanceOf(address token, address account) external view returns (uint256) {
//         return _balances[account];
//     }

//     // function that returns the total amount of funds deposited in aave
//     function getTotalDeposited(address token) external view returns (uint256) {
//         return IERC20(aToken).balanceOf(address(this));
//     }


// }
