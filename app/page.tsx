"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ExternalLink, Lock, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SplitText from "@/components/split-text"
import BetaBadge from "@/components/beta-badge"

export default function LandingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <main ref={containerRef} className="min-h-screen bg-white dark:bg-black">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            className="max-w-[90vw] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl font-bold tracking-wider"
              >
                AI-POWERED
              </motion.span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <SplitText
                text="DISCOVER YOUR"
                className="text-[clamp(2rem,8vw,6rem)] font-bold tracking-tight leading-none"
                type="chars"
              />
              <BetaBadge />
            </div>

            <SplitText
              text="CRYPTO IDENTITY"
              className="text-[clamp(2rem,8vw,6rem)] font-bold tracking-tight leading-none"
              type="chars"
              delay={0.2}
            />

            <motion.div
              className="mt-12 flex flex-col items-start gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-xl">
                <span className="font-bold">World's first</span> on-chain
                personality test with fully encrypted data processing using
                cutting-edge MPC technology by{" "}
                <span className="font-bold">Partisia Blockchain</span>.
              </p>

              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-2 border-black dark:border-white rounded-none px-8 py-6 text-lg hover:text-white dark:hover:text-black transition-colors"
                >
                  <motion.div
                    className="absolute inset-0 bg-black dark:bg-white z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Quiz
                    <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop"
            }}
          >
            <p className="text-sm uppercase tracking-widest mb-2 rotate-90 origin-left text-black dark:text-white">
              Scroll
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-neutral-100 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white">
              AI-POWERED RESEARCH
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              You're among the first to experience this groundbreaking AI
              technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-black p-8 border-t-2 border-black dark:border-white"
            >
              <Sparkles className="h-10 w-10 mb-6 text-black dark:text-white" />
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                AI ANALYSIS
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Advanced AI analyzes your responses while they remain fully
                encrypted, providing personalized insights without compromising
                privacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-black p-8 border-t-2 border-black dark:border-white"
            >
              <Lock className="h-10 w-10 mb-6 text-black dark:text-white" />
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                MPC TECHNOLOGY
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Powered by Partisia's Multi-Party Computation, allowing
                computations on your data while it remains fully encrypted.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-black p-8 border-t-2 border-black dark:border-white"
            >
              <Shield className="h-10 w-10 mb-6 text-black dark:text-white" />
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                ZERO KNOWLEDGE
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Your answers are processed securely without ever being exposed,
                even to us. True privacy by design.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white">
                AI + PRIVACY
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                Join an exclusive group of beta testers exploring the future of
                privacy-preserving AI applications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-neutral-100 dark:bg-neutral-900 p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                    HOW IT WORKS
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Your answers are encrypted on your device before being
                    processed by Partisia's secure MPC network. The computation
                    happens on-chain while your data remains fully encrypted,
                    ensuring complete privacy.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    This revolutionary approach allows us to analyze your
                    personality traits without ever seeing your actual
                    responses.
                  </p>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                    POWERED BY
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="https://partisiablockchain.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Partisia Blockchain <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href="https://partisiablockchain.gitlab.io/documentation/smart-contracts/introduction-to-smart-contracts.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Technical Documentation{" "}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href="https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/mpc-token-model-and-account-elements.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Learn about MPC <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href="https://partisiablockchain.gitlab.io/documentation/smart-contracts/machine-learning/machine-learning-on-pbc.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Build AI on Partisia <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold mb-8">
              READY TO DISCOVER
              <br />
              YOUR MATCH?
            </h2>

            <div className="flex flex-col items-center">
              <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-8">
                Take part in this groundbreaking AI experiment powered by
                Partisia Blockchain and discover which cryptocurrency matches
                your personality.
              </p>

              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-2 border-white text-gray-900 rounded-none px-8 py-6 text-lg hover:text-black transition-colors"
                >
                  <motion.div
                    className="absolute inset-0 bg-white z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Take the Quiz
                    <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 md:mb-0">
              © {new Date().getFullYear()} Crypto Personality Quiz | Powered by
              Partisia Blockchain | Beta Version 0.1
            </p>

            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <a
                href="https://partisiablockchain.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Partisia Blockchain
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
