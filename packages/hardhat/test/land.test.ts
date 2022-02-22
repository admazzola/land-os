import { Contract, Signer, BigNumber as BN } from 'ethers'
import * as hre from 'hardhat'
import { XBitcoinToken,  LandOS } from '../types/typechain'
import { use, should } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { solidity } from 'ethereum-waffle'
import { deploy } from '../utils/deploy-helpers'
 

use(chaiAsPromised)
use(solidity)
should()
 

const { getNamedSigner, contracts, deployments, ethers } = hre


interface TestSetupResult {
    mineableToken: XBitcoinToken
    landOS:LandOS
   
    deployer: Signer
    miner: Signer
  }
  


const setup = deployments.createFixture<TestSetupResult, never>(async () => {
    await hre.deployments.fixture('primary', {
      keepExistingDeployments: false
    })
  
    const deployer = await getNamedSigner('deployer')
    const miner = await getNamedSigner('miner')
  
    const mineableToken = await contracts.get<XBitcoinToken>('_0xBitcoinToken')  
    const landOS = await contracts.get<LandOS>('LandOS')  
  
    return {
      mineableToken,
      landOS,
      
      deployer,
      miner,
    }
  })
  



describe('LandOS', function () {
  let mineableToken: XBitcoinToken
  let landOS: LandOS
  
  let deployer: Signer
  let miner: Signer
   

  beforeEach(async () => {
    const result = await setup()
    mineableToken = result.mineableToken
    landOS = result.landOS
    
    deployer = result.deployer
    miner = result.miner
   
  })

    
  

  describe('MineableToken', () => {
    it('should have the Mineable Token address set', async () => {
      const tokenAddress = mineableToken.address
      tokenAddress.should.exist
    })
  })

  describe('LandOS', () => {
    it('should have the LandOS address set', async () => {
      const nftAddress = landOS.address
      nftAddress.should.exist
    })
  })

   
 
 
})
