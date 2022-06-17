import 'dotenv/config'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-deploy'
// import "hardhat-deploy-ethers";
import 'hardhat-gas-reporter'
import 'hardhat-spdx-license-identifier'
import 'hardhat-watcher'
import 'solidity-coverage'
import '@tenderly/hardhat-tenderly'
import './tasks'

import { HardhatUserConfig } from 'hardhat/config'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { removeConsoleLog } from 'hardhat-preprocessor'

const namedAccounts = {
  deployer: {
    default: 0,
  },
  admin: {
    default: 1,
  },
  dev: {
    default: 2,
  },
  owner: {
    default: 3,
  },
  wallet: {
    default: 4,
  },
  beneficiary1: {
    default: 5,
  },
  beneficiary2: {
    default: 6,
  },
  user: {
    default: 7,
  },
}

export type Signers = { [name in keyof typeof namedAccounts]: SignerWithAddress }

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // external: {
  //   contracts: [
  //     {
  //       artifacts: "node_modules/@sushiswap/contracts/artifacts",
  //       // Cannot use import statement outside a module?
  //       deploy: "node_modules/@sushiswap/contracts/deploy",
  //     },
  //   ],
  // },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true',
  },
  namedAccounts,
  networks: {
    mainnet: {
      url: 'https://rpc.c1.milkomeda.com:8545',
      accounts: [process.env.MILKOMEDA_PRIVATE_KEY!],
      chainId: 2001,
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local'],
    },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      },
      live: false,
      saveDeployments: true,
      tags: ['test', 'local'],
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
    testnet: {
      url: 'http://use-util.cloud.milkomeda.com:8545',
      accounts: [process.env.MILKOMEDA_PRIVATE_KEY!],
      chainId: 200101,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 15,
    },
  },
  preprocess: {
    eachLine: removeConsoleLog((bre) => bre.network.name !== 'hardhat' && bre.network.name !== 'localhost'),
  },
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./contracts'],
      verbose: true,
    },
  },
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default config
