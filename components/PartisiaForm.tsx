"use client"

import { useState } from "react"
import { usePartisiaContract } from "@/hooks/usePartisiaContract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PartisiaForm() {
  const [features, setFeatures] = useState<string>("")
  const { isLoading, error, submitFeatures, testConnection } =
    usePartisiaContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const featureArray = features.split(",").map(f => parseInt(f.trim()))
      await submitFeatures(featureArray)
    } catch (err) {
      console.error("Failed to submit:", err)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={features}
          onChange={e => setFeatures(e.target.value)}
          placeholder="Enter features (comma separated)"
          disabled={isLoading}
        />

        <div className="space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Features"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={testConnection}
            disabled={isLoading}
          >
            Test Connection
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
