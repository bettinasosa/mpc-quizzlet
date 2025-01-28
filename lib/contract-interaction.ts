import fs from "fs"
import path from "path"
import { BitOutput, CompactBitArray } from "@secata-public/bitmanipulation-ts"
import {
  BlockchainAddress,
  BlockchainPublicKey
} from "@partisiablockchain/abi-client"
import {
  Client,
  ZkRpcBuilder,
  RealZkClient,
  SignatureProviderKeyPair,
  CryptoUtils,
  SignatureProvider
} from "@partisiablockchain/zk-client"

// Replace with your actual private key (ensure it's securely managed)
const SENDER_PRIVATE_KEY = "your-private-key-hex"

// Address of your deployed ZK contract on testnet
const ZK_CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"

// Testnet node URL
const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"

// Function to load and serialize JSON to bits
function serializeJsonToBits(jsonObject: any): CompactBitArray {
  const jsonString = JSON.stringify(jsonObject)
  const jsonBuffer = Buffer.from(jsonString, "utf8")
  return CompactBitArray.fromBytes(jsonBuffer)
}

// Function to map the evaluation result bits to a personality index
function mapResultBitsToPersonality(
  bits: CompactBitArray,
  personalities: string[]
): string {
  // Assuming the result is an 8-bit one-hot array
  const byteArray = bits.toBytes()
  // Convert first byte to binary
  const binaryString = byteArray[0].toString(2).padStart(8, "0")
  const oneIndex = binaryString.indexOf("1")
  if (oneIndex === -1) return "Unknown"
  return personalities[oneIndex] || "Unknown"
}

// Function to retrieve engine public keys from the ZK contract state
function getEngineKeys(zkContract: any): BlockchainPublicKey[] {
  return zkContract.serializedContract.engines.engines.map((e: any) =>
    BlockchainPublicKey.fromBuffer(Buffer.from(e.publicKey, "base64"))
  )
}

// Function to broadcast a transaction to the Partisia node
async function broadcastTransaction(tx: any): Promise<string> {
  // Assuming the node has an RPC endpoint to accept transactions
  // Replace '/broadcast' with the actual endpoint if different
  const rpcUrl = `${TESTNET_URL}/broadcast`

  // Serialize the transaction. The SDK might provide a method to serialize.
  const serializedTx = tx.serialize() // Adjust based on SDK's serialization method

  try {
    const response = await axios.post(rpcUrl, {
      transaction: serializedTx.toString("hex")
    })

    if (response.status === 200 && response.data.txHash) {
      return response.data.txHash
    } else {
      throw new Error(`Broadcast failed: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    throw new Error(`Broadcast error: ${error}`)
  }
}

async function main() {
  try {
    // 1. Initialize the Blockchain Client
    const client = new Client(TESTNET_URL)
    console.log("Connected to Partisia Testnet.")

    // 2. Load the ZK Contract State
    const zkContractAddr = BlockchainAddress.fromString(ZK_CONTRACT_ADDRESS)
    // @ts-ignore
    const zkContract = await client.getContractState(zkContractAddr)
    if (!zkContract) {
      throw new Error("Failed to retrieve ZK contract state.")
    }
    console.log("Loaded ZK contract state.")

    // 3. Initialize the Signature Provider
    const keyPair = CryptoUtils.privateKeyToKeypair(SENDER_PRIVATE_KEY)
    const signatureProvider: SignatureProvider = new SignatureProviderKeyPair(
      keyPair
    )
    const senderAddress = CryptoUtils.keyPairToAccountAddress(keyPair)
    console.log(`Sender Address: ${senderAddress}`)

    // 4. Initialize the RealZkClient
    const rng = (len: number) => {
      // Secure RNG should be used in production
      return CryptoUtils.hashBuffer(Buffer.from("secure-random-seed")).slice(
        0,
        len
      )
    }
    const realZkClient = await RealZkClient.createForTest(
      // @ts-ignore
      zkContractAddr,
      client,
      rng
    )
    console.log("Initialized RealZkClient.")

    // 5. Load and Serialize the Model
    const modelPath = path.join(__dirname, "model.json")
    const modelJson = JSON.parse(fs.readFileSync(modelPath, "utf-8"))
    const modelBitArray = serializeJsonToBits(modelJson)
    console.log("Serialized model.json to bits.")

    // 6. Create and Upload the Model as an Off-Chain Input
    const modelShortname = Buffer.from([0x01]) // Replace with your actual shortname for "upload model"
    const modelRpc = ZkRpcBuilder.zkInputOffChain(
      modelBitArray,
      modelShortname,
      rng
    )
    const modelOffChainInput = realZkClient.buildOffChainInputTransaction(
      modelBitArray,
      modelShortname
    )

    // 7. Send the Model Transaction
    console.log("Sending model transaction...")
    const modelTx = modelOffChainInput.transaction

    // Since 'Transaction' lacks 'getHash' and 'setSignature', assume the SDK provides:
    // - A method to hash the transaction
    // - A method to set the signature
    // Adjust based on actual SDK methods

    // Example (pseudo-code):
    const modelTxHash = modelTx.hash() // Replace with actual hashing method
    const signedModelTx = await signatureProvider.sign(modelTxHash)
    modelTx.signature = signedModelTx // Replace with actual method to set signature

    // Broadcast the transaction
    const modelBroadcastTxHash = await broadcastTransaction(modelTx)
    console.log(`Model transaction sent. Tx Hash: ${modelBroadcastTxHash}`)

    // 8. Send the Blinded Shares to the MPC Nodes
    console.log("Sending blinded model shares to MPC nodes...")
    await realZkClient.sendOffChainInputToNodes(
      // @ts-ignore
      zkContractAddr,
      BlockchainAddress.fromString(senderAddress),
      modelBroadcastTxHash,
      modelOffChainInput.blindedShares
    )
    console.log("Blinded model shares sent to MPC nodes.")

    // 9. Prepare User Sample (Example Answers)
    const userAnswers = [1, 3, 2, 0, 1, 2, 3, 0, 2, 1] // Example: Replace with actual user answers
    const userSample = { values: userAnswers }
    const userSampleBitArray = serializeJsonToBits(userSample)
    console.log("Serialized user sample to bits.")

    // 10. Create and Upload the User Sample as an Off-Chain Input
    const sampleShortname = Buffer.from([0x02]) // Replace with your actual shortname for "upload sample"
    const sampleRpc = ZkRpcBuilder.zkInputOffChain(
      userSampleBitArray,
      sampleShortname,
      rng
    )
    const sampleOffChainInput = realZkClient.buildOffChainInputTransaction(
      userSampleBitArray,
      sampleShortname
    )

    // 11. Send the Sample Transaction
    console.log("Sending user sample transaction...")
    const sampleTx = sampleOffChainInput.transaction

    const sampleTxHash = sampleTx.hash() // Replace with actual hashing method
    const signedSampleTx = await signatureProvider.sign(sampleTxHash)
    sampleTx.signature = signedSampleTx // Replace with actual method to set signature

    // Broadcast the transaction
    const sampleBroadcastTxHash = await broadcastTransaction(sampleTx)
    console.log(
      `User sample transaction sent. Tx Hash: ${sampleBroadcastTxHash}`
    )

    // 12. Send the Blinded Shares to the MPC Nodes
    console.log("Sending blinded user sample shares to MPC nodes...")
    await realZkClient.sendOffChainInputToNodes(
      // @ts-ignore
      zkContractAddr,
      BlockchainAddress.fromString(senderAddress),
      sampleBroadcastTxHash,
      sampleOffChainInput.blindedShares
    )
    console.log("Blinded user sample shares sent to MPC nodes.")

    // 13. Invoke the `evaluate` Function on the ZK Contract
    console.log("Invoking the evaluate function on the ZK contract...")

    const evaluateShortname = Buffer.from([0x61]) // Replace with your actual shortname for "evaluate"

    // Prepare the input for the evaluate function
    // Assuming evaluate expects modelVarId and sampleVarId as 32-bit numbers
    const evaluateInput = BitOutput.serializeBits(out => {
      const modelVarId = 1 // Replace with actual variable ID from modelTx
      const sampleVarId = 2 // Replace with actual variable ID from sampleTx
      out.writeSignedNumber(modelVarId, 32)
      out.writeSignedNumber(sampleVarId, 32)
    })

    const evaluateRpc = ZkRpcBuilder.zkInputOnChain(
      // @ts-ignore
      zkContractAddr,
      evaluateInput,
      evaluateShortname,
      getEngineKeys(zkContract),
      undefined, // Optional encryption key
      rng
    )

    // Build the evaluate transaction
    const evaluateTx = await realZkClient.buildOnChainInputTransaction(
      // @ts-ignore
      zkContractAddr,
      evaluateRpc,
      evaluateShortname
    )

    // Sign and send the evaluate transaction
    const evaluateTxHash = evaluateTx.hash() // Replace with actual hashing method
    const signedEvaluateTx = await signatureProvider.sign(evaluateTxHash)
    evaluateTx.signature = signedEvaluateTx // Replace with actual method to set signature

    // Broadcast the evaluate transaction
    const evaluateBroadcastTxHash = await broadcastTransaction(evaluateTx)
    console.log(
      `Evaluate transaction sent. Tx Hash: ${evaluateBroadcastTxHash}`
    )

    // 14. Retrieve and Reveal the Evaluation Result
    // Assuming the contract stores the result in a new variable with a known ID
    const resultVariableId = 3 // Replace with actual result variable ID
    console.log("Retrieving evaluation result...")
    const resultBits = await realZkClient.fetchSecretVariable(
      signatureProvider,
      resultVariableId
    )
    const personalities = [
      "HODLer",
      "Degen",
      "NFT Flipper",
      "DeFi Wizard",
      "Privacy Maxi",
      "Developer",
      "Influencer",
      "Regulator"
    ]
    const personality = mapResultBitsToPersonality(resultBits, personalities)
    console.log(`User's Personality: ${personality}`)

    console.log("Interaction with ZK contract complete.")
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main()
