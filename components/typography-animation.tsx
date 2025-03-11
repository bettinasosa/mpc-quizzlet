"use client"

import { motion } from "framer-motion"

type TypographyAnimationProps = {
  text: string
  className?: string
  delay?: number
  staggerChildren?: number
  type?: "words" | "chars" | "lines"
}

export default function TypographyAnimation({
  text,
  className = "",
  delay = 0,
  staggerChildren = 0.03,
  type = "words",
}: TypographyAnimationProps) {
  let items: string[] = []

  if (type === "words") {
    items = text.split(" ")
  } else if (type === "chars") {
    items = text.split("")
  } else if (type === "lines") {
    items = text.split("\n")
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const item = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
      rotate: -2,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.span key={index} variants={item} className={`inline-block ${type === "words" ? "mr-[0.25em]" : ""}`}>
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.div>
  )
}

