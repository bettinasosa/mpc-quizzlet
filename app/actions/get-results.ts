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
    // Convert the one-hot vector into a personality label as needed
    const personality = convertOneHotToPersonality(result.secretOutput)
    console.log("Quiz result:", personality)
    return { success: true, personality }
  }
  return result
}

/**
 * Helper to translate a one-hot array into a personality label.
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
