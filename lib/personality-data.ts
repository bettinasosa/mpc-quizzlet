export const personalityData = {
  Degen: {
    description:
      "You're the ultimate risk-taker, always chasing the next big pump. FOMO is your middle name, and you believe in 'ape first, think later'.",
    traits: ["High risk tolerance", "Quick decision-making", "Always chasing trends"],
    image: "/placeholder.svg?height=300&width=400&text=🚀",
  },
  Influencer: {
    description:
      "You're the voice of the crypto community. Your opinions shape market sentiment, and your followers hang on your every word.",
    traits: ["Large social media presence", "Community building", "Trend-setting"],
    image: "/placeholder.svg?height=300&width=400&text=🎙️",
  },
  "NFT Enthusiast": {
    description:
      "You see the artistic and cultural value in blockchain technology. For you, crypto is more than just finance - it's a digital renaissance.",
    traits: ["Artistic appreciation", "Community involvement", "Digital collectibles expert"],
    image: "/placeholder.svg?height=300&width=400&text=🎨",
  },
  "DeFi Expert": {
    description:
      "You're at the forefront of financial innovation. Traditional finance is old news - you're all about decentralized protocols and yield optimization.",
    traits: ["Financial acumen", "Protocol analysis", "Yield farming pro"],
    image: "/placeholder.svg?height=300&width=400&text=📈",
  },
  Developer: {
    description:
      "You're the backbone of the crypto ecosystem. Your code shapes the future of blockchain technology and decentralized applications.",
    traits: ["Technical expertise", "Problem-solving skills", "Innovation-driven"],
    image: "/placeholder.svg?height=300&width=400&text=💻",
  },
  HODLer: {
    description:
      "You're in it for the long haul. Market volatility doesn't phase you - you've got diamond hands and unwavering conviction.",
    traits: ["Patient", "Long-term vision", "Strong belief in fundamentals"],
    image: "/placeholder.svg?height=300&width=400&text=💎",
  },
  "Privacy Advocate": {
    description:
      "You believe in the power of financial privacy. Anonymity isn't just a feature for you - it's a fundamental right.",
    traits: ["Security-conscious", "Values anonymity", "Advocates for privacy tech"],
    image: "/placeholder.svg?height=300&width=400&text=🕵️",
  },
  Trader: {
    description:
      "You thrive on market volatility. Armed with technical analysis and a keen eye for patterns, you're always looking for the next profitable trade.",
    traits: ["Analytical mindset", "Quick reflexes", "Risk management skills"],
    image: "/placeholder.svg?height=300&width=400&text=📊",
  },
}

export type PersonalityType = keyof typeof personalityData

