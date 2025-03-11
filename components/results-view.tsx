"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  LinkIcon,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import type { PersonalityType } from "@/lib/personality-data"

type ResultsViewProps = {
  result: {
    type: PersonalityType
    data: {
      description: string
      traits: string[]
      image: string
    }
    txHash: string
  }
  onReset: () => void
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const { type, data, txHash } = result
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }

  // Create share text
  const shareText = `I took the Crypto Personality Quiz powered by Partisia Blockchain and discovered I'm a ${type}! Take the quiz to find your crypto identity.`
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://crypto-personality-quiz.vercel.app"

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "width=550,height=420")

    setShareSuccess(true)
    setTimeout(() => {
      setShowShareOptions(false)
      setShareSuccess(false)
    }, 2000)
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(facebookUrl, "_blank", "width=550,height=420")

    setShareSuccess(true)
    setTimeout(() => {
      setShowShareOptions(false)
      setShareSuccess(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    const textToCopy = `${shareText}\n${shareUrl}`

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setShareSuccess(true)
          setTimeout(() => {
            setShowShareOptions(false)
            setShareSuccess(false)
          }, 2000)
        })
        .catch(err => {
          console.error("Failed to copy: ", err)
        })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = textToCopy
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        setShareSuccess(true)
        setTimeout(() => {
          setShowShareOptions(false)
          setShareSuccess(false)
        }, 2000)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }

      document.body.removeChild(textArea)
    }
  }

  // Function to truncate transaction hash for display
  const truncateHash = (hash: string) => {
    if (!hash) return ""
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  return (
    <div className="w-full border-2 border-black dark:border-white p-8">
      <div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={item}
            className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center mb-6"
          >
            <img
              src={data.image || "/placeholder.svg?height=200&width=200"}
              alt={type}
              className="w-16 h-16 object-contain"
            />
          </motion.div>

          <motion.h2
            variants={item}
            className="text-3xl font-bold text-black dark:text-white mb-2"
          >
            You are a {type}
          </motion.h2>

          <motion.div
            variants={item}
            className="flex flex-wrap gap-2 justify-center mb-6"
          >
            {data.traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-black dark:border-white text-black dark:text-white text-sm"
              >
                {trait}
              </span>
            ))}
          </motion.div>

          <motion.p
            variants={item}
            className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg"
          >
            {data.description}
          </motion.p>

          {txHash && (
            <motion.div
              variants={item}
              className="mb-8 flex flex-col items-center"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                Verified on Partisia Blockchain
              </p>
              <a
                href={`https://explorer.partisiablockchain.com/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-mono bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded hover:underline"
              >
                {truncateHash(txHash)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          )}

          <motion.div variants={item} className="flex gap-4">
            <motion.button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retake Quiz
            </motion.button>

            <motion.div className="relative">
              <motion.button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? "Shared!" : "Share Result"}
              </motion.button>

              {showShareOptions && (
                <motion.div
                  className="absolute top-full mt-2 right-0 bg-white dark:bg-black border-2 border-black dark:border-white p-2 min-w-[200px] z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={handleTwitterShare}
                      className="flex items-center gap-2 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white text-left"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={handleFacebookShare}
                      className="flex items-center gap-2 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white text-left"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white text-left"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 p-4 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <p>
              Your results were computed using AI and secure Multi-Party
              Computation (MPC) technology on the Partisia blockchain, ensuring
              your answers remain private. No individual data is stored or
              shared.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
