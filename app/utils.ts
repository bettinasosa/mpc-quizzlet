import type { AnswerData } from "./types"
import { personalityData } from "../lib/data/data"

// This is a simplified algorithm - in a real app, you'd have a more sophisticated scoring system
export function calculatePersonality(answers: AnswerData): string {
  // Count the frequency of each answer index (0-3)
  const answerCounts = [0, 0, 0, 0]

  Object.values(answers).forEach(answerIndex => {
    answerCounts[answerIndex]++
  })

  // Map answer patterns to personalities
  // This is simplified - you'd have a more complex algorithm in a real app
  const personalities = Object.keys(personalityData)

  if (answerCounts[0] >= 4) return "Degen" // Mostly risky answers
  if (answerCounts[3] >= 4) return "HODLer" // Mostly conservative answers
  if (answerCounts[2] >= 4) return "DeFi Expert" // Mostly balanced answers
  if (answerCounts[1] >= 3 && answerCounts[0] >= 2) return "Trader" // Mix of moderate and risky
  if (answerCounts[2] >= 3 && answerCounts[3] >= 2) return "Privacy Advocate" // Mix of balanced and conservative
  if (answerCounts[1] >= 4) return "NFT Enthusiast" // Mostly moderate answers
  if (answerCounts[0] >= 2 && answerCounts[3] >= 2) return "Influencer" // Mix of extremes

  // Default to Developer if no clear pattern
  return "Developer"
}

// Simulate MPC computation with a delay
export function simulateMPCComputation(answers: AnswerData): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(calculatePersonality(answers))
    }, 3000) // 3 second delay to simulate computation
  })
}
