
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IWADA {
    function deposit() external payable;

    function withdraw(uint256) external;
}