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

const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = process.env.PARTI_CONTRACT_ADDRESS!
const SENDER_ADDRESS = process.env.PARTI_WALLET_ADDRESS!

export async function sendZkInput(
  secretInputBuilder: any,
  inputData: any,
  fee: number = 18770
): Promise<{
  success: boolean
  txHash?: string
  secretOutput?: any
  error?: string
}> {
  try {
    // Initialize the zk client and transaction client.
    const zkClient = new Client(TESTNET_URL)
    const authentication = SenderAuthenticationKeyPair.fromString(
      process.env.PARTI_PRIVATE_KEY!
    )
    const transactionClient = BlockchainTransactionClient.create(
      TESTNET_URL,
      authentication
    )

    const contractAddr = BlockchainAddress.fromString(CONTRACT_ADDRESS)
    const senderAddr = BlockchainAddress.fromString(SENDER_ADDRESS)

    const builtSecret = secretInputBuilder.secretInput(inputData)
    const publicRpc = builtSecret.publicRpc
    const secretBits = builtSecret.secretInput

    // Create the off-chain payload (public RPC and blinded secret shares)
    const payload = ZkRpcBuilder.zkInputOffChain(secretBits, publicRpc)

    // Sign and send the public transaction.
    const tx = await transactionClient.signAndSend(
      {
        address: contractAddr.asString(),
        rpc: payload.rpc
      },
      fee
    )
    const txIdentifier = tx.transactionPointer.identifier
    console.log("Sent input in transaction:", txIdentifier.toString())

    // Create a RealZkClient to send off-chain secret shares.
    const realClient = RealZkClient.create(contractAddr.asString(), zkClient)
    await realClient.sendOffChainInputToNodes(
      contractAddr.asString(),
      senderAddr.asString(),
      txIdentifier,
      payload.blindedShares
    )
    console.log("Sent off-chain input to nodes...")

    // Wait for events from the transaction
    console.log("Waiting for transaction events...")
    const events = await transactionClient.waitForSpawnedEvents(tx)
    console.log("Transaction events received:", events.events)

    // Wait a bit to allow the contract to process the input
    console.log("Waiting for contract state to update...")
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Get the contract state to find the final variable
    const contractState = await zkClient.getContractState(
      contractAddr.asString()
    )
    if (!contractState || !contractState.serializedContract) {
      throw new Error("Failed to get contract state")
    }

    const variables = contractState.serializedContract.variables || []
    if (variables.length === 0) {
      throw new Error("No variables found in contract state")
    }

    const finalVar = variables[variables.length - 1]
    console.log("Final variable:", finalVar)

    if (!finalVar) {
      throw new Error("Final variable not found")
    }

    // Extract the one-hot vector from the final variable
    const oneHot = await extractFinalOneHot(finalVar)
    console.log("One hot vector:", oneHot)

    return { success: true, txHash: txIdentifier, secretOutput: oneHot }
  } catch (error) {
    console.error("sendZkInput failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Legacy function kept for compatibility
export async function extractFinalOneHot(finalVar: any): Promise<number[]> {
  if (
    !finalVar.value ||
    !finalVar.value.maskedInputShare ||
    !finalVar.value.information.data
  ) {
    throw new Error("Final variable does not contain maskedInputShare.data")
  }

  // Get the base64 string from the variable.
  const base64Data: string =
    finalVar.value.maskedInputShare.data || finalVar.value.maskedInputShare

  // Decode the base64 string into a Buffer.
  const dataBytes = Buffer.from(base64Data, "base64")

  // Extract the final 8 bytes which represent the one-hot vector.
  const oneHotBuffer = dataBytes.slice(32, 32 + 8)

  // Map each byte to 1 if it is exactly 1, else 0.
  const oneHot = Array.from(oneHotBuffer).map(b => (b === 1 ? 1 : 0))
  console.log("Extracted final one-hot vector:", oneHot)

  return oneHot
}
