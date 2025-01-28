import { BlockchainAddress } from "@partisiablockchain/abi-client"
import { serializeModel, serializeSample } from "./serializer"
import { ZkRpcBuilder } from "@partisiablockchain/zk-client"
import { BN } from "bn.js"

const ZK_CONTRACT = BlockchainAddress.fromString(
  "03be427dbe748f6e82f16548f28409b18171f09d4d"
)
const SENDER_PRIVATE_KEY = "your-private-key-hex"
const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"

async function main() {
  // 1. Initialize client
  const client = new Client(TESTNET_URL)
  const sender = TransactionSender.create(client, SENDER_PRIVATE_KEY)

  // 2. Load model data
  const model = {
    internals: [
      { feature: 1, threshold: 1 }
      // ... rest of your model internals
    ],
    leaves: [
      { classification: [1, 0, 0, 0, 0, 0, 0, 0] }
      // ... rest of your leaves
    ]
  }

  // 3. Serialize and send model
  const modelPayload = ZkRpcBuilder.zkInputOffChain(
    serializeModel(model),
    Buffer.from([0x40]) // Secret input shortcode
  )

  const modelTx = await sender.sendAndSign(
    { address: ZK_CONTRACT, rpc: modelPayload.rpc },
    new BN(100000)
  )
  console.log(
    "Model TX:",
    modelTx.transactionPointer.identifier.toString("hex")
  )

  // 4. Serialize and send sample
  const sampleAnswers = [1, 3, 2, 0, 1, 2, 3, 0, 2, 1] // Replace with actual answers
  const samplePayload = ZkRpcBuilder.zkInputOffChain(
    serializeSample(sampleAnswers),
    Buffer.from([0x41]) // Sample input shortcode
  )

  const sampleTx = await sender.sendAndSign(
    { address: ZK_CONTRACT, rpc: samplePayload.rpc },
    new BN(100000)
  )
  console.log(
    "Sample TX:",
    sampleTx.transactionPointer.identifier.toString("hex")
  )

  // 5. Trigger evaluation (assuming modelVarId=1, sampleVarId=2)
  const evaluatePayload = ZkRpcBuilder.zkCompute(
    ZK_CONTRACT,
    Buffer.from([0x61]), // evaluate shortname
    BitOutput.serializeBits(out => {
      out.writeNumber(1, 32) // modelVarId
      out.writeNumber(2, 32) // sampleVarId
    })
  )

  const evaluateTx = await sender.sendAndSign(
    { address: ZK_CONTRACT, rpc: evaluatePayload },
    new BN(100000)
  )
  console.log(
    "Evaluate TX:",
    evaluateTx.transactionPointer.identifier.toString("hex")
  )
}

main()
