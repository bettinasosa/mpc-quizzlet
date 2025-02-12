"use server"
import {
  Client,
  ZkRpcBuilder,
  RealZkClient
} from "@partisiablockchain/zk-client"
import {
  BlockchainTransactionClient,
  SenderAuthenticationKeyPair
} from "@partisiablockchain/blockchain-api-transaction-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"

// The helper function from your codegen:
import {
  addInputSample,
  Sample,
  SecretVarId
} from "@/lib/ClassificationCodegen"

const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = process.env.PARTI_CONTRACT_ADDRESS!
const SENDER_ADDRESS = process.env.PARTI_WALLET_ADDRESS!

export async function exampleAddSample(
  modelId: number = 1, // the secret var ID for the model
  sampleValues: number[] // length = 10
) {
  try {
    const zkClient = new Client(TESTNET_URL)
    const authentication = SenderAuthenticationKeyPair.fromString(
      process.env.PARTI_PRIVATE_KEY!
    )
    const transactionClient = BlockchainTransactionClient.create(
      TESTNET_URL,
      authentication
    )

    const contractAddr = BlockchainAddress.fromString(CONTRACT_ADDRESS)
    const receiverAddr = BlockchainAddress.fromString(SENDER_ADDRESS) // or whomever

    // 2. Create the transaction builder for addInputSample
    const modelIdObject: SecretVarId = { rawId: modelId }
    const secretInputBuilder = addInputSample(modelIdObject, receiverAddr)

    // 3. Build the secret payload
    const mySample: Sample = {
      values: sampleValues
    }
    const builtSecret = secretInputBuilder.secretInput(mySample)

    const publicRpc = builtSecret.publicRpc
    const secretBits = builtSecret.secretInput

    const payload = ZkRpcBuilder.zkInputOffChain(secretBits, publicRpc)

    const tx = await transactionClient.signAndSend(
      {
        address: contractAddr.asString(),
        rpc: payload.rpc
      },
      22000 // TODO: test it could be less??
    )
    const txIdentifier = tx.transactionPointer.identifier
    console.log("Transaction pointer:", txIdentifier.toString("hex"))

    const realClient = RealZkClient.create(contractAddr.asString(), zkClient)
    const tx_hash = await realClient.sendOffChainInputToNodes(
      contractAddr.asString(),
      SENDER_ADDRESS,
      txIdentifier,
      payload.blindedShares
    )
    console.log("Offchain input sent, tx_hash:", tx_hash)

    return { success: true, txHash: tx_hash }
  } catch (error) {
    console.error("Failed to add sample:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : ""
    }
  }
}
