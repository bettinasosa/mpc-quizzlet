"use server"

import { addInputSample, SecretVarId } from "@/lib/ClassificationCodegen"
import { sendZkInput } from "@/lib/sendZkInputHelper"
import { BlockchainAddress } from "@partisiablockchain/abi-client"

const SENDER_ADDRESS = process.env.PARTI_WALLET_ADDRESS!

export async function submitQuizAnswers(answers: number[]) {
  console.log("Submitting quiz answers...")

  const senderAddr = BlockchainAddress.fromString(SENDER_ADDRESS)

  const modelId: SecretVarId = { rawId: 1 }
  const secretInputBuilder = addInputSample(modelId, senderAddr)

  const inputData = { values: answers }

  const result = await sendZkInput(secretInputBuilder, inputData)
  if (result.success && result.secretOutput) {
    const personality = convertOneHotToPersonality(result.secretOutput)
    console.log("Quiz result:", personality)
    return { success: true, personality, txHash: result.txHash! }
  }

  return { success: false, personality: "", txHash: "" }
}

/**
 * Converts a one-hot representation into a personality label.
 * It accepts an array of bits (e.g. [1,0,0,0,0,0,0,0])
 */
function convertOneHotToPersonality(oneHot: number[]): string {
  const personalityMapping = [
    "HODLer",
    "Degen",
    "NFT Enthusiast",
    "DeFi Expert",
    "Privacy Advocate",
    "Developer",
    "Influencer",
    "Trader"
  ]
  const index = oneHot.findIndex(bit => bit === 1)
  return index >= 0 ? personalityMapping[index] : "Unknown"
}
