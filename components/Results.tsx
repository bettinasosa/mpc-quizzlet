"use client"
import React, { useState, useEffect } from "react"
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
  // A list of fun messages to display during loading.
  const loadingMessages = [
    "Crunching crypto numbers...",
    "Encrypting your secret responses...",
    "Performing MPC magic on the blockchain...",
    "Wrestling with complex algorithms...",
    "Mixing up some crypto personality juice...",
    "Ensuring your data stays private..."
  ]

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Cycle through loading messages every 3 seconds.
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLoading, loadingMessages.length])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Hang Tight! Your secure computation is underway...
        </h3>
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="max-w-lg text-center text-purple-600 text-md">
          {loadingMessages[currentMessageIndex]}
        </p>
        <p className="max-w-lg text-center text-gray-500 text-sm italic">
          Without MPC, third parties could easily infer your crypto investing
          tendencies. We're keeping your secrets safe – so relax, even if it
          takes a minute!
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="text-center p-8 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Your Crypto Personality:
        </h2>
        <PersonalityCard personality={result} />
        {txHash && (
          <p className="text-sm text-blue-600 underline">
            <a
              href={`https://explorer.testnet.partisiablockchain.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Transaction Details
            </a>
          </p>
        )}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-xl text-gray-800 mb-2">
            How This Works
          </h3>
          <p className="text-gray-700 text-base">
            Your answers were securely encrypted and processed using advanced
            Multi-Party Computation (MPC) on the Partisia blockchain. This
            ensures that even if your raw data were ever exposed, only the final
            personality result is revealed – your individual responses remain
            private.
          </p>
          <p className="mt-4 text-sm text-gray-600 italic">
            Imagine if these insights were sold to advertisers – they’d know all
            about your crypto investment habits! MPC protects you from that
            risk.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 text-center">
      <p className="text-gray-700">No result found yet.</p>
    </div>
  )
}
