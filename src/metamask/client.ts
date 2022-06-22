import MockDaiToken from '../abis/MockDaiToken.json'
import { MockDaiToken as mDaiType } from '../types/abi/MockDaiToken'
import YYToken from '../abis/MockDaiToken.json'
import { YYToken as YYTokenType } from '../types/abi/YYToken'
import TokenFarm from '../abis/TokenFarm.json'
import { TokenFarm as TokenFarmType } from '../types/abi/TokenFarm'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils';

export const tokenFarmClient = async (web3: Web3) => {
  const tokenFarmData = TokenFarm.networks['5777']
  const abi = TokenFarm.abi as any as AbiItem;

  return new web3.eth.Contract(abi, tokenFarmData.address) as unknown as TokenFarmType
}

export const mockDaiClient = async (web3: Web3) => {
  const daiTokenData = MockDaiToken.networks['5777']
  const abi = MockDaiToken.abi as any as AbiItem;

  return new web3.eth.Contract(abi, daiTokenData.address) as unknown as mDaiType
}

export const yyTokenClient = async (web3: Web3) => {
  const yyTokenData = YYToken.networks['5777']
  const abi = YYToken.abi as any as AbiItem;

  return new web3.eth.Contract(abi, yyTokenData.address) as unknown as YYTokenType
}
