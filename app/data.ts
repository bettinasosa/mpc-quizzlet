import type { Question } from "./types"

export const QUESTIONS: Question[] = [
  {
    question_id: 0,
    text: "How do you typically manage your crypto portfolio?",
    answers: [
      "Go all-in on a single altcoin",
      "Hold a few large caps, but not very diversified",
      "Balance across multiple market sectors",
      "Mostly stablecoins with small high-risk bets",
    ],
    icon: "💼",
  },
  {
    question_id: 1,
    text: "How do you react to a new DeFi protocol offering 1000% APY?",
    answers: [
      "Jump in immediately (YOLO)",
      "Research for a day or two, then decide",
      "Wait for a few months or stable yield",
      "Avoid it as likely unsustainable",
    ],
    icon: "💰",
  },
  {
    question_id: 2,
    text: "What portion of your net worth is in crypto?",
    answers: ["Over 75%", "Around half", "Less than 25%", "Under 5%"],
    icon: "📊",
  },
  {
    question_id: 3,
    text: "What's your stance on NFTs?",
    answers: [
      "I mint and flip them regularly for profit",
      "I collect a few for the art",
      "I only consider them if there's real utility",
      "I find them generally overhyped",
    ],
    icon: "🖼️",
  },
  {
    question_id: 4,
    text: "How important is on-chain privacy to you?",
    answers: [
      "I don't care, convenience is king",
      "It's somewhat important but I'm not paranoid",
      "I actively use privacy tools occasionally",
      "Privacy is crucial, I use privacy chains and mixers",
    ],
    icon: "🕵️",
  },
  {
    question_id: 5,
    text: "When a new altcoin presale goes live, do you...",
    answers: [
      "Ape in quickly with no research",
      "Check tokenomics for a few hours first",
      "Read a detailed audit, then maybe invest",
      "Rarely invest in presales at all",
    ],
    icon: "🚀",
  },
  {
    question_id: 6,
    text: "How do you typically handle your gains or tokens?",
    answers: [
      "Sell and rotate into next hype project",
      "Stake/farm for passive yield",
      "Prefer holding onto main tokens for the long run",
      "Reinvest in safer, stable assets or real-world holdings",
    ],
    icon: "📈",
  },
  {
    question_id: 7,
    text: "How do you engage with the broader crypto community?",
    answers: [
      "I rarely engage, just trade on my own",
      "Follow a few influencers on Twitter/YouTube",
      "Active in niche Discords for alpha & discussion",
      "Participate extensively in governance and forums",
    ],
    icon: "👥",
  },
  {
    question_id: 8,
    text: "Your stance on advanced DeFi strategies (leverage, MEV, etc.):",
    answers: [
      "Too complex, not interested",
      "I dabble in them lightly",
      "I optimize for gas & try different leveraged yields",
      "I code or fork them, I'm deeply involved",
    ],
    icon: "⚙️",
  },
  {
    question_id: 9,
    text: "When the market crashes 50% overnight, you usually...",
    answers: [
      "Panic sell everything",
      "HODL stoically, it's part of the cycle",
      "Look for bargains to buy more",
      "Publicly reassure or advise others (or panic them!)",
    ],
    icon: "📉",
  },
]

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

