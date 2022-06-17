import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  getChainId,
  ethers,
}: HardhatRuntimeEnvironment) {
  console.log('Running MISOLauncher deploy script')

  const chainId = parseInt(await getChainId())

  let wada
  if (chainId == 200101) {
    wada = '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9'
  } else if (chainId == 2001) {
    wada = '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9'
  }

  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const boxDeployment = await deploy('BentoBox', {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args: [wada],
  })

  const { address } = await deploy('MISOLauncher', {
    from: deployer,
    log: true,
    deterministicDeployment: false,
  })

  console.log('MISOLauncher deployed at ', address)

  const misoLauncher = await ethers.getContract('MISOLauncher')

  if ((await misoLauncher.accessControls()) === ethers.constants.AddressZero) {
    const accessControls = await ethers.getContract('MISOAccessControls')
    console.log('MISOAccessControls initilising')
    await (await misoLauncher.initMISOLauncher(accessControls.address, boxDeployment.address)).wait()
    console.log('MISOAccessControls initilised')
  }

  const launcherTemplateId: BigNumber = await misoLauncher.launcherTemplateId()

  if (launcherTemplateId.toNumber() == 0) {
    const postAuction = await ethers.getContract('PostAuctionLauncher')
    await (await misoLauncher.addLiquidityLauncherTemplate(postAuction.address)).wait()
  }
}

export default deployFunction

deployFunction.dependencies = ['MISOAccessControls', 'PostAuctionLauncher']

deployFunction.tags = ['MISOLauncher']
