const TokenFarm = artifacts.require('TokenFarm');
const YYToken = artifacts.require('YYToken');
const MockDaiToken = artifacts.require('MockDaiToken');

module.exports = async function(deployer, newtowrk, accounts) {
  await deployer.deploy(MockDaiToken);
  const daiToken = await MockDaiToken.deployed();

  await deployer.deploy(YYToken);
  const yyToken = await YYToken.deployed();

  await deployer.deploy(TokenFarm, yyToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await yyToken.transfer(tokenFarm.address, '1000000000000000000000000');

  await daiToken.transfer(accounts[1], '100000000000000000000');
};
