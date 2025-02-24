"use client"
import React from "react"
import { Loader2 } from "lucide-react"
import PersonalityCard from "./PersonalityCard"

interface ResultsProps {
  isLoading: boolean
  result: string | null
  txHash: string | null
  error: string | null
}

export default function Results({
  isLoading,
  result,
  txHash,
  error
}: ResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-4 text-gray-600">
          Computing your crypto personality securely... This may take a few
          moments.
        </p>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Your answers are being processed using advanced Multi‑Party
          Computation (MPC) on the Partisia blockchain. This secure process
          ensures that your individual responses remain private. Even if third
          parties were to gain access to this data, they would only be able to
          infer your final crypto personality without knowing your specific
          answers.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="text-center p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Your Crypto Personality:</h2>
        <PersonalityCard personality={result} />
        {txHash && (
          <p className="text-sm text-blue-600 underline">
            <a
              href={`https://explorer.testnet.partisiablockchain.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction details
            </a>
          </p>
        )}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">How This Works:</h3>
          <p className="text-gray-600">
            When you submit your answers, they are securely encrypted and
            processed on the Partisia blockchain using MPC. This means that no
            single party ever sees your full set of responses. The system only
            computes an aggregate result that determines your crypto
            personality. In the unlikely event that the data were misused, only
            the final classification would be exposed—not your individual
            answers.
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
