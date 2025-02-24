"use client"
import React from "react"
import { Loader2 } from "lucide-react"
import { usePersonalityContract } from "@/hooks/usePersonalityContract"
import PersonalityCard from "./PersonalityCard"

export default function Results() {
  const { isLoading, result } = usePersonalityContract()
  console.log("is loading...", isLoading)
  console.log("result", result)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-4 text-gray-600">
          Computing your crypto personality securely...
        </p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Your Crypto Personality:</h2>
        <PersonalityCard personality={result} />
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">How This Works:</h3>
          <p className="text-gray-600">
            Your answers were processed using advanced MPC on the Partisia
            blockchain, keeping your data private while determining your
            personality.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 text-center">
      <p>No result found yet.</p>
    </div>
  )
}
