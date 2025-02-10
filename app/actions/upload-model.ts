"use server"

import {
  Client,
  ZkRpcBuilder,
  RealZkClient
} from "@partisiablockchain/zk-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"
import {
  BlockchainTransactionClient,
  SenderAuthenticationKeyPair
} from "@partisiablockchain/blockchain-api-transaction-client"

import { addModel, Model } from "@/lib/ClassificationCodegen"

const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"
const SENDER_ADDRESS = "00f103c94985d4babb12d23845a37a23d5ee328076"

export async function uploadModel(modelData: Model) {
  console.log("Uploading model...")
  try {
    const zkClient = new Client(TESTNET_URL)
    const contractState = await zkClient.getContractState(CONTRACT_ADDRESS)
    console.log("contractState =", contractState)

    const authentication = SenderAuthenticationKeyPair.fromString(
      process.env.PARTISIA_PRIVATE_KEY!
    )
    const transactionClient = BlockchainTransactionClient.create(
      TESTNET_URL,
      authentication
    )

    const contractAddr = BlockchainAddress.fromString(CONTRACT_ADDRESS)
    const senderAddr = BlockchainAddress.fromString(SENDER_ADDRESS)

    const scalingConversion: number[] = [1000, 1000]
    const secretInputBuilder = addModel(scalingConversion)

    const builtSecret = secretInputBuilder.secretInput(modelData)

    const publicRpc = builtSecret.publicRpc
    const secretBits = builtSecret.secretInput

    console.log("builtSecret =", publicRpc, secretBits)

    const payload = ZkRpcBuilder.zkInputOffChain(secretBits, publicRpc)

    // 5) Sign & send the public transaction
    const tx = await transactionClient.signAndSend(
      {
        address: contractAddr.asString(),
        rpc: payload.rpc
      },
      17000
    )
    const txIdentifier = tx.transactionPointer.identifier
    console.log("Sent input in transaction: " + txIdentifier.toString("hex"))

    const realClient = RealZkClient.create(contractAddr.asString(), zkClient)

    const tx_hash = await realClient.sendOffChainInputToNodes(
      contractAddr.asString(),
      senderAddr.asString(),
      txIdentifier,
      payload.blindedShares
    )
    console.log("tx_hash =", tx_hash)

    return { success: true, txHash: tx.signedTransaction }
  } catch (error) {
    console.error("Model upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
