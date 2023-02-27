import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
      const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
      );

      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey || privateKey.length <= 0)
        throw new Error ("Missing environment: PRIVATE_KEY [Message from Seliana]")
      
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider)
      const balance = await signer.getBalance();
      console.log(`The account ${signer.address} has a balance of ${balance} Wei`)


    
    const args = process.argv;
    const proposals = args.slice(2)
    if (proposals.length <= 0) throw new Error ("Missing argument proposals! Message from Seliana");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  
  const ballotContractFactory = new Ballot__factory(signer);
  console.log("Deploying ballot contract...")
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  console.log("Awaiting for confirmations...");
  const txReceipt = await ballotContract.deployTransaction.wait();
  console.log(
    `The ballot contract was deployed at address ${ballotContract.address} in the block number ${txReceipt.blockNumber}`
  ); 
} 
   

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  });