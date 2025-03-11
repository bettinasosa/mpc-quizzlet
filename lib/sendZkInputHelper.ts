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
import { deserializeState } from "./ClassificationCodegen"

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

    // Build the secret input using the provided builder and data.
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

    // Wait for events from the transaction.
    const events = await transactionClient.waitForSpawnedEvents(tx)
    console.log(
      "Events received:",
      events.events,
      events.events[0].executionStatus,
      events.events[0].content
    )

    const contractState = await zkClient.getContractState(
      contractAddr.asString()
    )

    // console.log("Contract state:", contractState)

    const stateBytes = contractState?.serializedContract

    const finalVar = stateBytes?.variables[stateBytes.variables.length - 2]
    const oneHot = await extractFinalOneHot(finalVar)
    console.log("One hot:", oneHot)

    return { success: true, txHash: txIdentifier, secretOutput: oneHot }
  } catch (error) {
    console.error("sendZkInput failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function extractFinalOneHot(finalVar: any): Promise<number[]> {
  if (
    !finalVar.value ||
    !finalVar.value.maskedInputShare ||
    !finalVar.value.maskedInputShare.data
  ) {
    throw new Error("Final variable does not contain maskedInputShare.data")
  }

  // Get the base64 string from the variable.
  const base64Data: string = finalVar.value.maskedInputShare.data

  // Decode the base64 string into a Buffer.
  const dataBytes = Buffer.from(base64Data, "base64")
  console.log("Final variable data (hex):", dataBytes.toString("hex"))

  // Verify the expected length; for shareBitLengths of 232, expect 29 bytes.
  console.log("Data length (bytes):", dataBytes.length)

  // Extract the final 8 bytes which represent the one-hot vector.
  const oneHotBuffer = dataBytes.slice(32, 32 + 8)
  const deserialized = deserializeState(dataBytes)
  console.log("Deserialized:", deserialized)

  const packed = dataBytes.readUInt8(8) // adjust offset accordingly
  const oneHot1 = []
  for (let i = 0; i < 8; i++) {
    oneHot1.push((packed >> i) & 1)
  }
  console.log("Extracted final one-hot vector:", oneHot1)

  // Map each byte to 1 if it is exactly 1, else 0.
  const oneHot = Array.from(oneHotBuffer).map(b => (b === 1 ? 1 : 0))
  console.log("Extracted final one-hot vector:", oneHot)

  return oneHot
}
