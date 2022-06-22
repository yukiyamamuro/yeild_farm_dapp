const YYToken = artifacts.require('YYToken');
const MockDaiToken = artifacts.require('MockDaiToken');
const TokenFarm = artifacts.require('TokenFarm');

const { assert } = require('chai');
require(`chai`)
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let mockDaiToken, yyToken, tokenFarm

    before(async () =>{
        mockDaiToken = await MockDaiToken.new()
        yyToken = await YYToken.new()
        tokenFarm = await TokenFarm.new(yyToken.address, mockDaiToken.address)

        await yyToken.transfer(tokenFarm.address, tokens('1000000'));

        await mockDaiToken.transfer(investor, tokens('100'), {from: owner})
    })

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name = await mockDaiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('YY Token deployment', async () => {
        it('has a name', async () => {
            const name = await yyToken.name()
            assert.equal(name, 'YY Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, "Dapp Token Farm")
        })

        it('contract has tokens', async () => {
            let balance = await yyToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () => {
      it('farming test', async () => {
        let result
        result = await mockDaiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'com')

        await mockDaiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
        await tokenFarm.stakeTokens(tokens('100'), {from: investor})

        result = await mockDaiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('0'), 'com')

        result = await mockDaiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('100'), 'com')

        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(), tokens('100'), 'com')

        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'true', 'com')

        result = await tokenFarm.hasStaked(investor)
        assert.equal(result.toString(), 'true', 'com')
      })
      it('unfarming test', async () => {
        await tokenFarm.issueTokens({from: owner})
          let result
          result = await yyToken.balanceOf(investor)
          assert.equal(result.toString(), tokens('100'), 'investor Token wallet balance correct after staking')

          await tokenFarm.issueTokens({from: investor}).should.be.rejected
          await tokenFarm.unstakeTokens({from: investor})

          result = await mockDaiToken.balanceOf(investor)
          assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

          result = await mockDaiToken.balanceOf(tokenFarm.address)
          assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

          result = await tokenFarm.stakingBalance(investor)
          assert.equal(result.toString(), tokens('0'), 'investor staking status correct after staking')

          result = await tokenFarm.isStaking(investor)
          assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
      })
    })
})