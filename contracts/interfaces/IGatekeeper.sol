pragma solidity 0.6.12;

interface IGatekeeper {
    function checkPolicy(address _user, uint256 _amount) external returns (bool);
}