import fs from "fs"
import path from "path"
import bitManipulation from "@secata-public/bitmanipulation-ts"
const { BitOutput } = bitManipulation
import {
  Client,
  RealZkClient,
  CryptoUtils
} from "@partisiablockchain/zk-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"
import axios from "axios"
import type { Transaction } from "@partisiablockchain/blockchain-api-transaction-client"

const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SHORTNAME_UPLOAD_MODEL = Buffer.from([0x61])

// Load & parse model from file
function loadModelJson() {
  const filePath = path.join(process.cwd(), "model.json")
  const raw = fs.readFileSync(filePath, "utf8")
  return JSON.parse(raw)
}

// Serialize your Model
function serializeModel(modelObj: any): Uint8Array {
  return BitOutput.serializeBits(out => {
    // 7 internals
    for (let i = 0; i < 7; i++) {
      const { feature, threshold } = modelObj.internals[i]
      out.writeUnsignedNumber(feature, 8) // Sbu8
      out.writeSignedNumber(threshold, 16) // Sbi16
    }
    // 8 leaves
    for (let i = 0; i < 8; i++) {
      const classification = modelObj.leaves[i].classification // [8 bits]
      for (let b = 0; b < 8; b++) {
        out.writeBoolean(classification[b] === 1)
      }
    }
  })
}

// roadcast a transaction to the Partisia node ????
// async function broadcastTransaction(tx: Transaction): Promise<string> {
//   const serialized = tx.rpc
//   const url = `${TESTNET_URL}/transaction`
//   const response = await axios.post(url, {
//     transaction: serialized.toString("hex")
//   })
//   // Expect the node to return { txHash: "..." }
//   if (response.data.txHash) {
//     return response.data.txHash
//   }
//   throw new Error(
//     `No txHash in broadcast response: ${JSON.stringify(response.data)}`
//   )
// }

async function main() {
  try {
    console.log("Starting model upload process...")

    // Connect to testnet
    console.log("Connecting to testnet:", TESTNET_URL)
    const client = new Client(TESTNET_URL)

    // Confirm the contract state is accessible
    console.log("Checking contract state for address:", CONTRACT_ADDRESS)
    const contractAddr = BlockchainAddress.fromString(CONTRACT_ADDRESS)
    const zkContract = await client.getContractState(contractAddr.asString())
    if (!zkContract) {
      throw new Error(`No contract state found at ${CONTRACT_ADDRESS}`)
    }
    console.log("Found contract state:", zkContract)

    // Create a RealZkClient referencing the contract
    function rng(len: number): Buffer {
      const array = new Uint8Array(len)
      crypto.getRandomValues(array)
      return Buffer.from(array)
    }
    const realZkClient = await RealZkClient.createForTest(
      contractAddr.asString(),
      client,
      rng
    )

    // Prepare the model data
    const modelObj = loadModelJson()
    const modelBits = serializeModel(modelObj)

    // Build an ON-CHAIN input transaction??
    const senderKeyPair = CryptoUtils.privateKeyToKeypair(PRIVATE_KEY)
    const senderAddress = BlockchainAddress.fromString(
      CryptoUtils.keyPairToAccountAddress(senderKeyPair)
    )
    console.log("Building on-chain input transaction...")

    const onChainTx = await realZkClient.buildOnChainInputTransaction(
      senderAddress.asString(),
      modelBits,
      SHORTNAME_UPLOAD_MODEL
    )

    // TODO: Sign, Send & broadcast

    // Next, send the shares to the nodes so they can reconstruct "modelBits."
    const offChainTx = realZkClient.buildOffChainInputTransaction(
      modelBits,
      SHORTNAME_UPLOAD_MODEL
    )

    console.log("Sending shares to MPC nodes referencing the real txHash...")
    await realZkClient.sendOffChainInputToNodes(
      contractAddr.asString(),
      senderAddress.asString(),
      txHash, //TODO: pass the real chain TX hash
      offChainTx.blindedShares
    )

    console.log("Successfully uploaded model and sent shares.")
  } catch (err) {
    console.error("Error uploading model:", err)
    process.exit(1)
  }
}

main().catch(err => {
  console.error("FATAL:", err)
  process.exit(1)
})
