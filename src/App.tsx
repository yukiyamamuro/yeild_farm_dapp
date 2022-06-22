import { FC, useCallback, useEffect, useState } from "react";
import Web3 from 'web3';
import { Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";

import { tokenFarmClient, mockDaiClient, yyTokenClient } from "./metamask/client";
import TokenFarm from './abis/TokenFarm.json'

export const App: FC = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:7545`));
  const [account, setAccount] = useState('xxxxxxxxxx');
  const [mockDai, setMockDai] = useState('');
  const [yyToken, setYYToken] = useState('');

  useEffect(()=>{
    const f = async () => {
      const accounts = await web3.eth.getAccounts()
      const currentAccount = accounts[1]
      console.log('Account: ', currentAccount)
      setAccount(currentAccount)


      const mDaiClient = await mockDaiClient(web3);
      const dai = await mDaiClient.methods.balanceOf(currentAccount).call()
      console.log('MockDai: ', dai)
      setMockDai(dai)

      const yyClient = await yyTokenClient(web3);
      const yy = await yyClient.methods.balanceOf(currentAccount).call()
      console.log('YYToken: ', yy)
      setYYToken(yy)
    }
    f();
  },[])

  const handleStakeToken = async()=>{
    console.log("STAKE!!!!!!")
    const amount = 1000000000000
    const mDaiClient = await mockDaiClient(web3);
    const tFarmClient = await tokenFarmClient(web3);

    mDaiClient.methods.approve(TokenFarm.networks[5777].address, amount).send({from: account, gas: 1000000}).on('transactionHash', (hash) =>{
      tFarmClient.methods.stakeTokens(amount).send({from: account, gas: 1000000})
    })
  }

  const handleUnstakeToken = async () => {
    const tFarmClient = await tokenFarmClient(web3);
    console.log("UNSTAKE.....")
    tFarmClient.methods.unstakeTokens().send({from: account, gas: 1000000})
  }

  return (
    <Container sx={{ margin: '100px' }}>
      <Grid container spacing={3}>
        <Grid item xs={2} />
        <Grid item xs={4}>
          <Typography variant="h4" color={"GrayText"}>Staking Balance</Typography>
          <Typography variant='h5' margin={'20px'}>{mockDai} mDAI</Typography>
        </Grid>
        <Grid item xs={4} height='150px'>
          <Typography variant="h4"  color={"GrayText"}>Reward Balance</Typography>
          <Typography variant='h5' margin={'20px'}>{yyToken} YYT</Typography>
        </Grid>
        <Grid item xs={2} />
      </Grid>
      <Card sx={{ padding: '50px', margin: '80px' }}>
        <Stack spacing={2}>
          <Typography variant="h3">Stake Tokens</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField fullWidth placeholder="0"/>
            </Grid>
            <Grid item xs={4}>
              <Typography>mDAI</Typography>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleStakeToken}>STAKE!!</Button>
          <Button variant="outlined" onClick={handleUnstakeToken}>UN-STAKE...</Button>
          <Typography>Account: {account}</Typography>
        </Stack>
      </Card>
    </Container>
  )
}
