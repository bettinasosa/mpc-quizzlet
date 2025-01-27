import { FnRpcBuilder, BlockchainAddress } from "@partisiablockchain/abi-client"
import { Client } from "@partisiablockchain/zk-client"
import { BN } from "@partisiablockchain/abi-client"
import { serializeModel } from "./serializer"

const ZK_CONTRACT = BlockchainAddress.fromString("your-contract-address")
const SENDER_PRIVATE_KEY = "your-private-key"

async function submitModel(model: any) {
  const client = new Client("https://node1.testnet.partisiablockchain.com")

  // 1. Serialize model
  const serializedModel = serializeModel(model)

  // 2. Create payload
  const payload = new FnRpcBuilder().secret(
    serializedModel,
    Buffer.from([0x40]) // Secret input invocation
  )

  // 3. Send transaction
  const tx = await client.sendTransaction(
    { address: ZK_CONTRACT, rpc: payload.rpc },
    SENDER_PRIVATE_KEY,
    new BN(100000) // Gas limit
  )

  console.log(
    "Submitted in tx:",
    tx.transactionPointer.identifier.toString("hex")
  )
}

// Example usage with your model
const model = {
  internals: [
    { feature: 1, threshold: 1 }
    // ... rest of your internals
  ],
  leaves: [
    { classification: [1, 0, 0, 0, 0, 0, 0, 0] }
    // ... rest of your leaves
  ]
}

submitModel(model)
