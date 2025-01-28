import type { NextApiRequest, NextApiResponse } from "next"
import {
  SecretInputBuilder,
  TransactionBuilder,
  CryptoUtils,
  SignatureProviderKeyPair
} from "@partisiablockchain/zk-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"
import axios from "axios"

const PRIVATE_KEY = process.env.PARTISIA_PRIVATE_KEY || "0x..."
const TESTNET_NODE = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"

const SHORTNAME_EVALUATE = 0x61 // from your Rust: #[zk_compute(shortname = 0x61)]

async function broadcastTx(serializedTx: Buffer): Promise<string> {
  const url = `${TESTNET_NODE}/broadcast`
  const resp = await axios.post(url, {
    transaction: serializedTx.toString("hex")
  })
  return resp.data.txHash
}

export default async function evaluateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed")
    }

    const { modelVarId, answers } = req.body
    if (!modelVarId || !answers) {
      return res.status(400).json({ error: "Missing modelVarId or answers" })
    }

    // 1) Create a sample object matching your Rust contract's "Sample" struct
    //    i.e. { values: [Sbi16; 10] }
    //    But keep it in JSON form for the "secret input"
    const sampleObj = {
      values: answers
    }

    // 2) Build a secret input for the sample
    const sampleSecretInput = new SecretInputBuilder()
      .withJson(sampleObj)
      .build()

    // 3) Build the transaction referencing the "evaluate" function
    //    We also must pass the modelVarId and sampleVarId to the contract.
    //    Typically you do so in "public arguments" or "extra data" that the contract uses to find the variables.
    //    But if your contract needs them as "secret arguments," that’s trickier.
    //    Let's assume they're "public" for demonstration.

    const txBuilder = new TransactionBuilder()
    txBuilder.setActionShortname(SHORTNAME_EVALUATE)
    txBuilder.setContractAddress(BlockchainAddress.fromString(CONTRACT_ADDRESS))
    txBuilder.setSecretInput(sampleSecretInput)

    // Possibly set extra fields or param data if needed:
    //    txBuilder.addPublicArgument("modelVarId", modelVarId)
    //    txBuilder.addPublicArgument("sampleVarId", 999) // or a new var ID?

    // 4) Sign
    const keyPair = CryptoUtils.privateKeyToKeypair(PRIVATE_KEY)
    const signatureProvider = new SignatureProviderKeyPair(keyPair)

    const tx = txBuilder.build()
    const txHash = tx.hash() // hypothetical method
    const signature = await signatureProvider.sign(txHash)
    tx.setSignature(signature)

    // 5) Broadcast
    const broadcastTxHash = await broadcastTx(tx.serialize())
    console.log(`Evaluate transaction broadcast, txHash = ${broadcastTxHash}`)

    // 6) The contract presumably creates a new secret var with the 8-bit result.
    //    We'll pretend that var is ID=101. In a real scenario you parse the receipt or contract state.
    const resultVarId = 101

    return res
      .status(200)
      .json({ success: true, txHash: broadcastTxHash, resultVarId })
  } catch (err) {
    console.error("Error evaluating contract:", err)
    return res.status(500).json({ error: String(err) })
  }
}
