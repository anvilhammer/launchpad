import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
}: HardhatRuntimeEnvironment) {
  console.log('Running MISOMarket deploy script')

  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

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
      await misoMarket.initMISOMarket(
        accessControls.address,
        '0xF4A376B4c4dcc8c9C538BECE0e47374DB64E2433',
        [dutchAuction.address],
        {
          from: deployer,
        }
      )
    ).wait()
    console.log('MISOMarket initilising')
  }
}

export default deployFunction

deployFunction.dependencies = ['MISOAccessControls', 'DutchAuction']

deployFunction.tags = ['MISOMarket']
