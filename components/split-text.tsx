"use client"

import { motion } from "framer-motion"

type SplitTextProps = {
  text: string
  className?: string
  type?: "chars" | "words"
  delay?: number
}

export default function SplitText({ text, className = "", type = "words", delay = 0 }: SplitTextProps) {
  const items = type === "chars" ? text.split("") : text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  }

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="visible">
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ marginRight: type === "words" ? "0.25em" : "0" }}
        >
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.h1>
  )
}

