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
})