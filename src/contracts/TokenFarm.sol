pragma solidity ^0.5.0;

import "./YYToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm {
  string public name = "Dapp Token Farm";
  address public owner;
  YYToken public yyToken;
  MockDaiToken public mockDaiToken;

  address[] public stakers;

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(YYToken _yyToken, MockDaiToken _mockDaiToken) public {
    yyToken = _yyToken;
    mockDaiToken = _mockDaiToken;
    owner = msg.sender;
  }

  function stakeTokens(uint _amount) public {
    require(_amount > 0, "amount must be over 0");
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    if(!hasStaked[msg.sender]){
      stakers.push(msg.sender);
    }
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
    mockDaiToken.transferFrom(msg.sender, address(this), _amount);
  }

  function issueTokens () public {
    require(msg.sender == owner, "caller must be the owner");
    for(uint i = 0; i < stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        yyToken.transfer(recipient, balance);
      }
    }
  }

  function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, "balance must be over 0");
    stakingBalance[msg.sender] = 0;
    isStaking[msg.sender] = false;
    mockDaiToken.transfer(msg.sender, balance);
  }
}
