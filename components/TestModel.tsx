import {
  CryptoUtils,
  SignatureProviderKeyPair,
  ZkRpcBuilder,
  OffChainInputRpc,
  RealZkClient,
  OffChainInput,
  Client
} from "@partisiablockchain/zk-client"
import {
  BlockchainTransactionClient,
  SenderAuthenticationKeyPair
} from "@partisiablockchain/blockchain-api-transaction-client"
import {
  AbiByteOutput,
  BlockchainAddress,
  BN
} from "@partisiablockchain/abi-client"
import { CompactBitArray } from "@secata-public/bitmanipulation-ts"

// The user’s private key, used to sign transactions:
const MY_PRIVATE_KEY_HEX = "0xabc123..."

const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const ML_CONTRACT_ADDRESS = process.env.ML_CONTRACT_ADDRESS as string

async function main() {
  // 1) Prepare a blockchain client
  const host = "https://testnet.partisiablockchain.com"
  const chainClient = new Client(host) // or specify shardCount

  // 2) Convert private key -> keypair -> signature provider
  const myKeypair = CryptoUtils.privateKeyToKeypair(MY_PRIVATE_KEY_HEX)
  const signatureProvider = new SignatureProviderKeyPair(myKeypair)

  // 3) The address of the contract
  const CONTRACT_ADDRESS = BlockchainAddress.fromString(
    "03be427dbe748f6e82f16548f28409b18171f09d4d"
  )

  // 4) Create a RealZkClient for actual ZK operations
  //    We'll assume we have a local random generator. For production, use secure random.
  const rng = (len: number) =>
    CryptoUtils.hashBuffer(Buffer.from("some pseudo-random seed")).subarray(
      0,
      len
    )
  const realZkClient = await RealZkClient.createForTest(
    CONTRACT_ADDRESS,
    chainClient,
    rng
  )

  // 5) Suppose we have a "model" object in JSON form. We'll encode it as bits:
  const modelObj = {
    internals: [
      { feature: 2, threshold: 1 },
      { feature: 0, threshold: 2 }
      // ...
    ],
    leaves: [
      { classification: [1, 0, 0, 0, 0, 0, 0, 0] }
      // ...
    ]
  }
  // We need to convert that JSON to a bit array. Typically you'd do this with a custom "serializeToBits" function.
  const modelString = JSON.stringify(modelObj)
  const modelBuffer = Buffer.from(modelString, "utf8")
  // Convert to bits in some manner.
  // (Here, we do a trivial approach with "bitmanipulation-ts" or your own logic)
  const modelBitArray = CompactBitArray.fromBytes(modelBuffer)

  // 6) Build an OFF-CHAIN input transaction for the model
  //    You need an additionalRpc buffer specifying the "shortname" for the 'ZK input' method
  //    or referencing the variable creation. For example, let's guess shortname = 0x01 for "upload data".
  const shortname = Buffer.from([0x01]) // example short
  // Then build off-chain input
  const offChainRpc: OffChainInputRpc = ZkRpcBuilder.zkInputOffChain(
    modelBitArray,
    shortname,
    rng
  )

  // 7) Now we have `blindedShares` and `rpc`. We can build a transaction:
  const offChainInput: OffChainInput =
    realZkClient.buildOffChainInputTransaction(modelBitArray, shortname)
  // This gives `offChainInput.transaction` (the actual Tx) and `offChainInput.blindedShares`.

  // 8) We sign and send that transaction to the chain
  const onChainTx = offChainInput.transaction
  // The transaction might require your signature
  const txHash = onChainTx.getHash() // depends on your local library usage
  const signature = await signatureProvider.sign(txHash)
  onChainTx.setSignature(signature)

  // broadcast the transaction:
  // (the code might differ in your environment, maybe chainClient has something like:)
  const txHashHex = await chainClient.broadcastTransaction(onChainTx)
  console.log("Broadcasted off-chain input Tx:", txHashHex)

  // 9) We must also send the shares to the nodes.
  await realZkClient.sendOffChainInputToNodes(
    CONTRACT_ADDRESS,
    BlockchainAddress.fromString(
      CryptoUtils.keyPairToAccountAddress(myKeypair)
    ), // our address
    txHashHex,
    offChainInput.blindedShares
  )
  console.log("Sent blinded shares to each ZK node.")

  // 10) At this point, your contract “knows” you created a new secret variable with ID X (the chain assigns).
  //     Next step is to call your contract’s function "evaluate" referencing the new variable ID for the model.

  // Typically you do another transaction with a shortname for "evaluate". For example:
  //    shortname = 0x61 (like in your Rust code).
  // The arguments to "evaluate" might be (modelVarId, sampleVarId). But you'd do the same approach:
  //   buildOnChainInputTransaction or you might do a direct contract call if it doesn't require additional secret input.

  // 11) If the function outputs a new secret variable, you'd fetch it afterwards:
  // Suppose the contract stores the result in variable ID=99. Then to reveal:
  const resultBits = await realZkClient.fetchSecretVariable(
    signatureProvider,
    99
  )
  // Convert bits -> a final integer or array
  const resultBuffer = resultBits.toBytes()
  console.log("Result as text:", resultBuffer.toString("utf8"))

  // Or if it’s multi-bit classification, parse it accordingly.
  console.log("Done")
}

main().catch(console.error)
