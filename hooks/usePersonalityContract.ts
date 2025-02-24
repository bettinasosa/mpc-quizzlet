import { useState } from "react"
import { submitQuizAnswers } from "@/app/actions/get-results"

export function usePersonalityContract() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const submitAnswers = async (answers: number[]) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    console.log("getting results")

    try {
      const result = await submitQuizAnswers(answers)

      if (!result.success) {
        console.log("here")
        throw new Error("Failed to send answers")
      }

      const personality = result?.personality!
      setResult(personality || "Unknown personality")
      console.log(result)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to submit answers")
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
