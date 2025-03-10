import { useState } from "react"
import { submitQuizAnswers } from "@/app/actions/get-results"

export function usePersonalityContract() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const submitAnswers = async (
    answers: number[]
  ): Promise<{ success: boolean; personality: string; txHash: string }> => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setTxHash(null)
    console.log("getting results")

    try {
      const res = await submitQuizAnswers(answers)
      if (!res.success) {
        throw new Error("Failed to send answers")
      }

      setResult(res.personality || "Unknown personality")
      setTxHash(res.txHash)
      console.log("result:", res)
      return res
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to submit answers")
      return { success: false, personality: "", txHash: "" }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitAnswers,
    isLoading,
    error,
    result,
    txHash
  }
}
