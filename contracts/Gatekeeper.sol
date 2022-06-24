pragma solidity 0.6.12;

import "./interfaces/IERC20.sol";
import "./Access/MISOAccessControls.sol";
import "./interfaces/IGatekeeper.sol";

contract Gatekeeper is IGatekeeper, MISOAccessControls {
    IERC20 public creamy;

    mapping(address => uint256) public policies;
    
    constructor (address _creamy) public {
        creamy = IERC20(_creamy);
    }

    function setPolicy(address _auction, uint256 _minimum) external {
        require(hasAdminRole(msg.sender), "Unauthorized");
        policies[_auction] = _minimum;
    }

    function checkPolicy(address _user, uint256 _amount) external override returns (bool _accepted) {
        _accepted = creamy.balanceOf(_user) >= policies[msg.sender];
    }
}