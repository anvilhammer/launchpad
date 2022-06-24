import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
  getChainId,
}: HardhatRuntimeEnvironment) {
  console.log('Running MISOMarket deploy script')

  const chainId = await getChainId()

  let wada
  if (chainId == '200101') {
    wada = '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9'
  } else if (chainId == '2001') {
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

  const { address } = await deploy('MISOMarket', {
    from: deployer,
    log: true,
    deterministicDeployment: false,
  })

  console.log('MISOMarket deployed at ', address)

  const misoMarket = await ethers.getContract('MISOMarket')

  const templateId: BigNumber = await misoMarket.auctionTemplateId()

  if (templateId.toNumber() === 0) {
    const accessControls = await ethers.getContract('MISOAccessControls')
    const dutchAuction = await ethers.getContract('DutchAuction')
    console.log('MISOMarket initilising')
    await (
      await misoMarket.initMISOMarket(accessControls.address, boxDeployment.address, [dutchAuction.address], {
        from: deployer,
        gasLimit: 1000000,
      })
    ).wait()
    console.log('MISOMarket initilising')
  }
}

export default deployFunction

deployFunction.dependencies = ['MISOAccessControls', 'DutchAuction']

deployFunction.tags = ['MISOMarket']
