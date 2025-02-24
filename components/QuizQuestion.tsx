import React from "react"
import { motion } from "framer-motion"

interface QuizQuestionProps {
  question: { text: string; answers: string[] }
  questionIndex: number
  selectedAnswer: number | undefined
  onAnswer: (questionIndex: number, answerIndex: number) => void
  isCurrent: boolean
}

export default function QuizQuestion({
  question,
  questionIndex,
  selectedAnswer,
  onAnswer,
  isCurrent
}: QuizQuestionProps) {
  const getEmoji = (text: string) => {
    const emojiMap: { [key: string]: string } = {
      cocktail: "🍸",
      animal: "🐾",
      meme: "😂",
      Elon: "🚀",
      vacation: "🏖️",
      rugged: "💔",
      day: "📉",
      tokens: "💎",
      tools: "🛠️",
      portfolio: "💼",
      gas: "⛽",
      bots: "🤖",
      DeFi: "💰",
      MEV: "🕵️",
      L2: "⚡",
      Discord: "💬",
      alpha: "🔥",
      NFT: "🖼️",
      CEX: "🏦",
      skill: "🧠",
      governance: "🗳️",
      win: "🏆",
      exploits: "🚨",
      taxes: "📊"
    }
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return emoji
      }
    }
    return "❓"
  }

  return (
    <motion.div
      className={`space-y-6 ${isCurrent ? "opacity-100" : "opacity-50"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isCurrent ? 1 : 0.5, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold text-2xl text-gray-800 mb-4">
        <span className="mr-2">{getEmoji(question.text)}</span>
        {question.text}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.answers.map((answer, index) => (
          <motion.button
            key={index}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedAnswer === index
                ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onAnswer(questionIndex, index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium text-lg">{answer}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
