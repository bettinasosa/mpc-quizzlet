import { useState } from "react"
import { PERSONALITY_TYPES } from "@/lib/constants"

const CONTRACT_ADDRESS =
  "497d97c67a3a5b7021756993c1575e5a30dfa61e34ed3dcaa879ccba33536f6a"

export const usePersonalityContract = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const submitAnswers = async (answers: number[]) => {
    setIsLoading(true)
    setError(null)

    try {
      // Scale answers to 0-1000 range for ZK circuit
      const scaledFeatures = answers.map(a => Math.floor((a / 3) * 1000))

      //TODO: Submit answers to contract
      const personalityType = "0"

      if (personalityType !== null) {
        setResult(PERSONALITY_TYPES[personalityType])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitAnswers,
    isLoading,
    error,
    result
  }
}
