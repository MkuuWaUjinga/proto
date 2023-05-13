// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "aave-v3-core/contracts/interfaces/IPool.sol";
import "aave-v3-core/contracts/interfaces/IPoolAddressesProvider.sol";

contract DepositModule {

    // Aave V3 Lending Pool Addresses Provider address
    address private constant LENDING_POOL_ADDRESSES_PROVIDER = 0x0000000000000000000000000000000000000000; // Replace with the correct address

    // Mapping from token address to mapping of account balances
    mapping(address => uint256) private _balances;

    function deposit(address token, uint256 amount) external {
        // Transfer the tokens to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Approve Aave Lending Pool to use the tokens
        IERC20(token).approve(_getLendingPool(), amount);

        // Deposit the tokens into the Aave Lending Pool
        IPool(_getLendingPool()).deposit(token, amount, address(this), 0);

        // Update the balance
        _balances[msg.sender] += amount;
    }

    function withdraw(address token, uint256 amount) external {
        require(_balances[msg.sender] >= amount, "Insufficient balance.");

        // Update the balance
        _balances[msg.sender] -= amount;

        // Withdraw the tokens from the Aave Lending Pool
        IPool(_getLendingPool()).withdraw(token, amount, msg.sender);
    }

    function balanceOf(address token, address account) external view returns (uint256) {
        return _balances[account];
    }

    function _getLendingPool() private view returns (address) {
        return IPoolAddressesProvider(LENDING_POOL_ADDRESSES_PROVIDER).getPool();
    }
}
