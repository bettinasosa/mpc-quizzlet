"use client"

import { motion } from "framer-motion"

type AnimatedTextProps = {
  text: string
  className?: string
  once?: boolean
  delay?: number
  duration?: number
  type?: "words" | "chars"
}

export default function AnimatedText({
  text,
  className = "",
  once = false,
  delay = 0,
  duration = 0.05,
  type = "words",
}: AnimatedTextProps) {
  // Split text into words
  const words = text.split(" ")

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: duration, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  if (type === "chars") {
    // Split text into characters
    const chars = text.split("")

    return (
      <motion.div
        className={`inline-flex overflow-hidden ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
      >
        {chars.map((char, index) => (
          <motion.span key={index} variants={child} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block mr-1">
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

