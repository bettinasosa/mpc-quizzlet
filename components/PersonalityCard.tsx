import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { personalityData } from "../lib/data/personalityData"

interface PersonalityCardProps {
  personality: string
}

export default function PersonalityCard({ personality }: PersonalityCardProps) {
  const data = personalityData[personality]

  const getBackgroundColor = (personality: string) => {
    const colorMap: { [key: string]: string } = {
      Degen: "#E5E7EB",
      Influencer: "#DBEAFE",
      "NFT Enthusiast": "#E0E7FF",
      "DeFi Expert": "#ECFDF5",
      Developer: "#EDE9FE",
      HODLer: "#FEF3C7",
      "Privacy Advocate": "#E5E7EB",
      Trader: "#F3F4F6"
    }
    return colorMap[personality] || "#F9FAFB"
  }

  const getEmojiFromImage = (imageUrl: string) => {
    const match = imageUrl.match(/text=(.+)/)
    return match ? match[1] : ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto mt-8 overflow-hidden shadow-lg">
        <div className="relative h-48">
          <motion.div
            className="absolute inset-0 bg-cover bg-center flex items-center justify-center text-6xl"
            style={{
              backgroundColor: getBackgroundColor(personality)
            }}
          >
            {getEmojiFromImage(data.image)}
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white text-center">
              {personality}
            </h2>
          </motion.div>
        </div>
        <CardContent className="p-6 bg-white">
          <motion.p
            className="text-lg text-gray-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {data.description}
          </motion.p>
          <motion.h3
            className="font-bold text-xl mb-2 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your Crypto Traits:
          </motion.h3>
          <motion.ul
            className="list-disc list-inside text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {data.traits.map((trait, index) => (
              <motion.li
                key={index}
                className="text-base mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                {trait}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
