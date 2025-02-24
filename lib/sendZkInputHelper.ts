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
import { pollForSecretOutput } from "./helpers"

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

    console.log("sent off-chain input to nodes...")

    // Instead of waitForSecretOutput, poll for the secret output.
    const secretOutput = await pollForSecretOutput(realClient, txIdentifier)

    return {
      success: true,
      txHash: txIdentifier,
      secretOutput
    }
  } catch (error) {
    console.error("sendZkInput failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
