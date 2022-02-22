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
   

  before(async () => {
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


    it('should mint some tokens', async () => {
        let testMint = await mineableToken.connect(miner).testMint( 0 );

        let minerAddress = await miner.getAddress()
 
        let newBalance = await mineableToken.balanceOf(minerAddress)

        newBalance.should.eql(5000000000);
      })
  })

  describe('LandOS', () => {
    it('should have the LandOS address set', async () => {
      const nftAddress = landOS.address
      nftAddress.should.exist
    })

    it('should be able to mint land', async () => {

        let amount = 1000000000

        let tokenId = 0;

        console.log('amount',amount )

        let calldata = ethers.utils.defaultAbiCoder.encode([ "uint256" ], [ tokenId ]);
        
        console.log('calldata',calldata)

        let testMint = await mineableToken
        .connect(miner)
        .approveAndCall( landOS.address, amount, calldata );

        console.log(testMint)

      })


      it('should not be able to mint land past current supply', async () => {

        let amount = 1000000000

        let tokenId = 2; 
        
        let calldata = ethers.utils.defaultAbiCoder.encode([ "uint256" ], [ tokenId ]);
        
        
        let testMint = await mineableToken
        .connect(miner)
        .approveAndCall( landOS.address, amount, calldata )
        .should.be.reverted  

      })


  })

   
 
 
})
