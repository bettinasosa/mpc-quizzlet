import { Client } from "@partisiablockchain/zk-client"

const CONTRACT_ADDRESS =
  "497d97c67a3a5b7021756993c1575e5a30dfa61e34ed3dcaa879ccba33536f6a"

export const getPartisiaClient = () => {
  return new Client({
    baseUrl: "https://node1.testnet.partisia.io",
    wallet: "0x00f103c94985d4babb12d23845a37a23d5ee328076"
  })
}

export const getContractAbi = () => ({
  // Contract ABI matching our Rust contract
  functions: {
    add_input_sample: {
      arguments: [{ name: "features", type: "Vec<u16>" }],
      name: "add_input_sample",
      return_type: "Unit"
    },
    get_personality: {
      arguments: [],
      name: "get_personality",
      return_type: "Option<u8>"
    }
  }
})

export const sendInputToContract = async (features: number[]) => {
  const client = getPartisiaClient()
  const abi = getContractAbi()

  const payload = {
    contract: CONTRACT_ADDRESS,
    abi,
    functionName: "add_input_sample",
    arguments: [features]
  }

  try {
    const result = await client.putZkInputOnChain(payload)
    return result
  } catch (error) {
    console.error("Error sending input to contract:", error)
    throw error
  }
}

export const verifyContractConnection = async () => {
  const client = getPartisiaClient()

  try {
    // First verify the contract exists
    const contractState = await client.getContractState(CONTRACT_ADDRESS)
    if (!contractState) {
      throw new Error("Contract not found at specified address")
    }

    // Try to call a read function to verify ABI
    const result = await client.contract({
      contract: CONTRACT_ADDRESS,
      abi: getContractAbi(),
      functionName: "get_personality",
      arguments: []
    })

    console.log("Contract connection verified:", result)
    return true
  } catch (error) {
    console.error("Contract connection failed:", error)
    throw error
  }
}

export const testContractConnection = async () => {
  try {
    // First verify the connection
    console.log("Verifying contract connection...")
    await verifyContractConnection()

    // Try sending some test data
    console.log("Sending test input...")
    const testFeatures = [1, 2, 3, 4, 5] // Example u16 values
    const result = await sendInputToContract(testFeatures)

    console.log("Test input sent successfully:", result)

    // Try reading the personality after input
    const personality = await client.contract({
      contract: CONTRACT_ADDRESS,
      abi: getContractAbi(),
      functionName: "get_personality",
      arguments: []
    })

    console.log("Current personality value:", personality)
    return true
  } catch (error) {
    console.error("Contract test failed:", error)
    throw error
  }
}
