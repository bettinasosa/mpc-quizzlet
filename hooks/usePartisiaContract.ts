import { useState } from "react"
import {
  sendInputToContract,
  verifyContractConnection,
  testContractConnection
} from "@/lib/partisia-client"

export const usePartisiaContract = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personality, setPersonality] = useState<number | null>(null)

  const submitFeatures = async (features: number[]) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await sendInputToContract(features)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit features")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await testContractConnection()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection test failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    personality,
    submitFeatures,
    testConnection
  }
}
