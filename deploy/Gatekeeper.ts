import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployFunction: DeployFunction = async function ({ deployments, getNamedAccounts }: HardhatRuntimeEnvironment) {
  console.log('Running Gatekeeper deploy script')
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const { address } = await deploy('Gatekeeper', {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args: ['0xCF8e5f8B7701868Ba71C8E60aEbE211eaAF4eE81'],
  })

  console.log('Gatekeeper deployed at ', address)
}

export default deployFunction

deployFunction.dependencies = []

deployFunction.tags = ['Gatekeeper']
