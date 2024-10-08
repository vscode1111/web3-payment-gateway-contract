import dayjs from 'dayjs';
import { ZeroAddress } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { MINUTES, toUnixTime, toUnixTimeUtc, toWei } from '~common';
import { MATAN_WALLET, TokenAddressDescription } from '~common-contract';
import { Token } from '~constants';
import { DeployNetworkKey } from '~types';
import { addSecondsToUnixTime } from '~utils';
import { getTokenDescription } from '~utils/contracts';
import { defaultNetwork } from '../hardhat.config';
import { ContractConfig, DeployContractArgs, DeployTokenArgs, TokenConfig } from './types';

type DeployType = 'test' | 'main' | 'stage' | 'prod';

const deployType: DeployType = (process.env.ENV as DeployType) ?? 'main';

const isWeb3 = ['test', 'main'].includes(deployType);
// const isWeb3 = false;

// const isProd = deployType === ('prod' as any);
// if (isProd) {
//   throw 'Are you sure? It is PROD!';
// }

export const chainTokenDescription: Record<DeployNetworkKey, TokenAddressDescription> = {
  // bsc: isWeb3 ? getTokenDescription(Token.WEB3) : getTokenDescription(Token.USDT), //WEB3/USDT
  bsc: isWeb3 ? getTokenDescription(Token.tWEB3) : getTokenDescription(Token.USDT), //WEB3/USDT
};

export const { address: tokenAddress, decimals: tokenDecimals } =
  chainTokenDescription[defaultNetwork];

const priceDiv = BigInt(1);
const userDiv = BigInt(2);
export const now = dayjs();

export const contractConfigDeployMap: Record<DeployType, Partial<ContractConfig>> = {
  test: {
    newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF', //My s-owner2
    depositVerifier: '0x99FbD0Bc026128e6258BEAd542ECB1cF165Bbb98', //My s-deposit
    coldWallet: '0x21D73A5dF25DAB8AcB73E782f71678c3b00A198F', //My s-coldWallet
    balanceLimit: toWei(1000, tokenDecimals) / priceDiv,
  },
  main: {
    newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF', //My s-owner2
    depositVerifier: '0x99FbD0Bc026128e6258BEAd542ECB1cF165Bbb98', //My s-deposit
    depositGoal: toWei(100, tokenDecimals),
    withdrawVerifier: ZeroAddress,
    withdrawGoal: BigInt(1),
    coldWallet: '0x21D73A5dF25DAB8AcB73E782f71678c3b00A198F', //My s-coldWallet
    balanceLimit: toWei(100, tokenDecimals) / priceDiv,
    startDate: toUnixTimeUtc(new Date(2024, 6, 25, 9, 10, 0)),
    // closeDate: 0,
    closeDate: toUnixTimeUtc(new Date(2024, 6, 26, 11, 0, 0)),
  },
  stage: {
    // newOwner: MATAN_WALLET,
    newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF', //My s-owner2
    coldWallet: '0x79734Db10D301C257093E594A8A245D384E22c68', //Andrey MultiSig
    depositVerifier: '0x99FbD0Bc026128e6258BEAd542ECB1cF165Bbb98', //My s-deposit
    depositGoal: toWei(15, tokenDecimals),
    balanceLimit: toWei(1_000_000, tokenDecimals),
    withdrawVerifier: ZeroAddress,
    withdrawGoal: BigInt(1),
    // startDate: 0,
    startDate: toUnixTimeUtc(new Date(2024, 6, 25, 9, 12, 0)),
    // closeDate: 0,
    closeDate: toUnixTimeUtc(new Date(2024, 6, 26, 11, 0, 0)),
  },
  prod: {
    newOwner: MATAN_WALLET,
    coldWallet: '0x79734Db10D301C257093E594A8A245D384E22c68', //Andrey MultiSig
    depositVerifier: '0x99FbD0Bc026128e6258BEAd542ECB1cF165Bbb98', //My s-deposit
    depositGoal: toWei(50_000, tokenDecimals),
    balanceLimit: toWei(1_000_000, tokenDecimals),
    withdrawVerifier: ZeroAddress,
    withdrawGoal: BigInt(1),
    // startDate: 0,
    startDate: toUnixTimeUtc(new Date(2024, 8, 12, 13, 0, 0)),
    // closeDate: 0,
    closeDate: toUnixTimeUtc(new Date(2024, 8, 13, 8, 0, 0)),
  },
};

const extContractConfig = contractConfigDeployMap[deployType];

export const contractConfig: ContractConfig = {
  newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF',
  erc20Token: tokenAddress,
  depositVerifier: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF',
  depositGoal: toWei(4_000, tokenDecimals) / priceDiv,
  withdrawVerifier: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF',
  withdrawGoal: toWei(6_000, tokenDecimals) / priceDiv,
  startDate: toUnixTime(now.add(1, 'days').toDate()),
  closeDate: toUnixTime(now.add(2, 'days').toDate()),
  coldWallet: '0x21D73A5dF25DAB8AcB73E782f71678c3b00A198F',
  balanceLimit: toWei(1000, tokenDecimals),
  ...extContractConfig,
};

export function getContractArgs(contractConfig: ContractConfig): DeployContractArgs {
  const {
    newOwner,
    erc20Token,
    depositVerifier,
    depositGoal,
    withdrawVerifier,
    withdrawGoal,
    startDate,
    closeDate,
    coldWallet,
    balanceLimit,
  } = contractConfig;

  return [
    {
      newOwner,
      erc20Token,
      depositVerifier,
      depositGoal,
      withdrawVerifier,
      withdrawGoal,
      startDate,
      closeDate,
      coldWallet,
      balanceLimit,
    },
  ];
}

export const tokenConfig: TokenConfig = {
  name: 'empty',
  symbol: 'empty',
  newOwner: '0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791',
  initMint: toWei(1_000_000_000, tokenDecimals),
  decimals: tokenDecimals,
};

export function getTokenArgs(newOwner: string): DeployTokenArgs {
  return [
    tokenConfig.name,
    tokenConfig.symbol,
    newOwner,
    tokenConfig.initMint,
    tokenConfig.decimals,
  ];
}

const userInitBalance = toWei(10_000, tokenDecimals) / priceDiv;
const deposit1 = toWei(100, tokenDecimals) / priceDiv;
const extraDeposit1 = toWei(2500, tokenDecimals) / priceDiv;
const withdraw1 = toWei(30, tokenDecimals) / priceDiv;
const extraWithdraw1 = toWei(3000, tokenDecimals) / priceDiv;

const userId1 = uuidv4();
const userId2 = uuidv4();

const depositTransactionId1 = uuidv4();
const depositTransactionId2_0 = uuidv4();
const depositTransactionId2_1 = uuidv4();
const withdrawTransactionId1_0 = uuidv4();
const withdrawTransactionId1_1 = uuidv4();
const withdrawTransactionId2 = uuidv4();

export const seedData = {
  zero: toWei(0),
  userInitBalance,
  totalAccountBalance: tokenConfig.initMint,
  deposit1,
  deposit2_0: deposit1 / userDiv,
  deposit2_1: contractConfig.depositGoal - deposit1 - deposit1 / userDiv,
  deposit3: deposit1 / userDiv / userDiv,
  extraDeposit1,
  extraDeposit2: extraDeposit1 / userDiv,
  extraDeposit3: extraDeposit1 / userDiv / userDiv,
  withdraw1,
  withdraw2: withdraw1 / userDiv,
  withdraw3: withdraw1 / userDiv / userDiv,
  extraWithdraw1,
  extraWithdraw2: extraWithdraw1 / userDiv,
  extraWithdraw3: extraWithdraw1 / userDiv / userDiv,
  balanceLimit: toWei(100, tokenDecimals),
  allowance: toWei(1000000, tokenDecimals),
  balanceDelta: toWei(0.01, tokenDecimals),
  nowPlus1m: toUnixTime(now.add(1, 'minute').toDate()),
  startDatePlus1m: addSecondsToUnixTime(contractConfig.startDate, 1 * MINUTES),
  closeDatePlus1m: addSecondsToUnixTime(contractConfig.closeDate, 1 * MINUTES),
  timeShift: 10,
  userId1,
  userId2,
  depositTransactionId1,
  depositTransactionId2_0,
  depositTransactionId2_1,
  withdrawTransactionId1_0,
  withdrawTransactionId1_1,
  withdrawTransactionId2,
  invalidNonce: 999,
  depositNonce1_0: 0,
  depositNonce1_1: 1,
  depositNonce2_0: 0,
  depositNonce3_0: 0,
  withdrawNonce1_0: 0,
  withdrawNonce1_1: 1,
  withdrawNonce2_0: 0,
  withdrawNonce3_0: 0,
};
