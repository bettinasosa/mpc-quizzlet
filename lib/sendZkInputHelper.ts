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

    const oneHot = await extractOpenOneHot(stateBytes)
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

export async function extractOpenOneHot(state: any): Promise<number[]> {
  const finalVar = state.variables[state.variables.length - 2]

  console.log("Final variable:", finalVar)
  if (!finalVar.value || !finalVar.value.maskedInputShare.data) {
    throw new Error("Final variable does not contain data")
  }

  const dataBase64: string = finalVar.value.maskedInputShare.data

  const dataBytes = Buffer.from(dataBase64, "base64")

  console.log("Final variable data (hex):", dataBytes.toString("hex"))

  const alternate = Buffer.from(
    finalVar.value.maskedInputShare.data.toString("hex")
  )

  const oneHotBytes = dataBase64.slice(dataBase64.length - 8)

  const oneHot = Array.from(dataBytes.slice(dataBytes.length - 8)).map(b =>
    b === 1 ? 1 : 0
  )

  const alternateOneHot = Array.from(alternate.slice(alternate.length - 8)).map(
    b => (b === 1 ? 1 : 0)
  )

  console.log("Extracted final one-hot vector:", oneHot)
  console.log("Extracted alternate one-hot vector:", alternateOneHot)
  return oneHot
}
