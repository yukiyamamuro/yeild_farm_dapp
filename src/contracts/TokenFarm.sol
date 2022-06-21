pragma solidity ^0.5.0;

import "./YYToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm {
  string public name = "Dapp Token Farm";

  YYToken public yyToken;
  MockDaiToken public mockDaiToken;

  constructor(YYToken _yyToken, MockDaiToken _mockDaiToken) public {
    yyToken = _yyToken;
    mockDaiToken = _mockDaiToken;
  }
}
