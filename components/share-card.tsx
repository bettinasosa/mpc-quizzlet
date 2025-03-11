"use client"

import type { PersonalityType } from "@/lib/personality-data"

type ShareCardProps = {
  type: PersonalityType
  traits: string[]
}

export default function ShareCard({ type, traits }: ShareCardProps) {
  return (
    <div className="w-[1200px] h-[630px] bg-white flex flex-col items-center justify-center p-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">I am a {type}</h1>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {traits.map((trait, index) => (
            <span key={index} className="px-6 py-3 bg-black text-white text-xl font-medium">
              {trait}
            </span>
          ))}
        </div>

        <p className="text-2xl mb-12">
          Discover your crypto personality with the AI-powered quiz by Partisia Blockchain
        </p>

        <div className="text-xl font-bold">crypto-personality-quiz.vercel.app</div>
      </div>
    </div>
  )
}

