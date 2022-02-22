import { DeployFunction } from 'hardhat-deploy/types'

import { deploy } from '../utils/deploy-helpers'
import { BigNumberish, BigNumber as BN } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getTokens, getNetworkName} from '../config'

const deployOptions: DeployFunction = async (hre) => {
  const { getNamedSigner, run, network, log } = hre
  const deployer = await getNamedSigner('deployer')

  const tokens = getTokens(network)

  const treasuryAddress = "0xB11ca87E32075817C82Cc471994943a4290f4a14"

  // Make sure contracts are compiled
  await run('compile')

  log('')
  log('********** Deploying **********', { indent: 1 })
  log('')
 

  const tokenContract = await deploy({
    contract: '_0xBitcoinToken',
    args: [ ], 
    hre,
    
  })

  const landNFT = await deploy({
    contract: 'LandOS',
    args: [ tokenContract.address, treasuryAddress ], 
    hre,
    
  })
}

deployOptions.tags = ['primary']
deployOptions.dependencies = []

export default deployOptions
