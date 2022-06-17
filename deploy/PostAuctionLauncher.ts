import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { WNATIVE_ADDRESS } from '@sushiswap/core-sdk'

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  getChainId,
}: HardhatRuntimeEnvironment) {
  console.log('Running PostAuctionLauncher deploy script')

  const chainId = parseInt(await getChainId())

  let wada
  if (chainId == 200101) {
    wada = '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9'
  } else if (chainId == 2001) {
    wada = '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9'
  }

  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const { address } = await deploy('PostAuctionLauncher', {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args: [wada],
  })

  console.log('PostAuctionLauncher deployed at ', address)
}

export default deployFunction

deployFunction.dependencies = []

deployFunction.tags = ['PostAuctionLauncher']
