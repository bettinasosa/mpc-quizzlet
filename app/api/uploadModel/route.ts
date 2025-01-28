// pages/api/uploadModel.ts

import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import {
  SignatureProviderKeyPair,
  CryptoUtils,
  SecretInputBuilder,
  TransactionBuilder
} from "@partisiablockchain/zk-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"
import axios from "axios"

// For demonstration only: store your private key in environment variables
const PRIVATE_KEY = process.env.PARTISIA_PRIVATE_KEY || "0x..."

const TESTNET_NODE = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"

// Shortname for "uploading the model" (you must define this in your contract)
const SHORTNAME_UPLOAD_MODEL = 0x01 // or 0x40, or any you used in your Rust

// For your Rust contract, you store a "Model" struct. We'll just read your model.json
function loadModelJson() {
  const modelPath = path.join(process.cwd(), "model.json")
  return JSON.parse(fs.readFileSync(modelPath, "utf8"))
}

async function broadcastTx(serializedTx: Buffer): Promise<string> {
  // You might need a different endpoint or structure. This is conceptual
  const url = `${TESTNET_NODE}/broadcast`
  const resp = await axios.post(url, {
    transaction: serializedTx.toString("hex")
  })
  // Suppose the response has a `txHash` field
  return resp.data.txHash
}

export default async function uploadModelHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed")
    }

    // 1) Load your model from local file
    const modelObj = loadModelJson()

    // 2) Build a secret input using the library.
    //    The exact usage depends on your version.
    //    Suppose we have "SecretInputBuilder" that can take JSON directly:
    const secretInput = new SecretInputBuilder().withJson(modelObj).build()

    // 3) Now we need to create an on-chain transaction referencing the shortname
    //    For example:
    const txBuilder = new TransactionBuilder()
    txBuilder.setActionShortname(SHORTNAME_UPLOAD_MODEL)
    txBuilder.setContractAddress(BlockchainAddress.fromString(CONTRACT_ADDRESS))
    txBuilder.setSecretInput(secretInput)

    // 4) Sign the transaction
    //    Convert your private key -> key pair -> sign
    const keyPair = CryptoUtils.privateKeyToKeypair(PRIVATE_KEY)
    const signatureProvider = new SignatureProviderKeyPair(keyPair)

    const tx = txBuilder.build()
    const hashToSign = tx.hash() // if the library provides .hash()
    const signature = await signatureProvider.sign(hashToSign)
    tx.setSignature(signature) // if the library provides .setSignature()

    // 5) Serialize the transaction
    const serializedTx = tx.serialize() // or .toBytes() or whichever method

    // 6) Broadcast
    const txHash = await broadcastTx(serializedTx)

    // In a real system, you'd parse the contract's open state or
    // transaction receipt to find the newly created "modelVarId"
    // For demonstration, let's pretend it's "100".
    const modelVarId = 100

    return res.status(200).json({
      success: true,
      txHash,
      modelVarId
    })
  } catch (err) {
    console.error("Error uploading model:", err)
    return res.status(500).json({ error: String(err) })
  }
}
