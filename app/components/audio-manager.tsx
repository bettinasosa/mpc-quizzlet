"use client"

import { useEffect, useRef } from "react"

interface AudioManagerProps {
  stage: "welcome" | "questions" | "loading" | "results"
}

export default function AudioManager({ stage }: AudioManagerProps) {
  const backgroundRef = useRef<HTMLAudioElement | null>(null)
  const uiClickRef = useRef<HTMLAudioElement | null>(null)
  const transitionRef = useRef<HTMLAudioElement | null>(null)
  const successRef = useRef<HTMLAudioElement | null>(null)
  const hoverRef = useRef<HTMLAudioElement | null>(null)

  const prevStageRef = useRef(stage)
  const isInitializedRef = useRef(false)

  // Initialize audio elements
  useEffect(() => {
    // Only initialize once
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    try {
      // Background ambient sound
      backgroundRef.current = new Audio()
      backgroundRef.current.loop = true
      backgroundRef.current.volume = 0.2

      // UI sounds
      uiClickRef.current = new Audio()
      uiClickRef.current.volume = 0.3

      hoverRef.current = new Audio()
      hoverRef.current.volume = 0.1

      transitionRef.current = new Audio()
      transitionRef.current.volume = 0.4

      successRef.current = new Audio()
      successRef.current.volume = 0.4

      // Add global event listeners for UI sounds if document is available
      if (typeof document !== "undefined") {
        document.addEventListener("click", handleGlobalClick)
      }
    } catch (error) {
      console.error("Error initializing audio:", error)
    }

    return () => {
      // Clean up
      if (typeof document !== "undefined") {
        document.removeEventListener("click", handleGlobalClick)
      }

      if (backgroundRef.current) {
        backgroundRef.current.pause()
      }
    }
  }, [])

  // Handle stage transitions
  useEffect(() => {
    if (prevStageRef.current !== stage) {
      // Play transition sound
      if (transitionRef.current) {
        try {
          transitionRef.current.currentTime = 0
          transitionRef.current.play().catch(() => {})
        } catch (error) {
          console.error("Error playing transition sound:", error)
        }
      }

      // Play success sound when reaching results
      if (stage === "results" && successRef.current) {
        try {
          successRef.current.currentTime = 0
          successRef.current.play().catch(() => {})
        } catch (error) {
          console.error("Error playing success sound:", error)
        }
      }

      prevStageRef.current = stage
    }
  }, [stage])

  // Handle global click events
  const handleGlobalClick = (e: MouseEvent) => {
    if (!uiClickRef.current) return

    const target = e.target as HTMLElement

    // Only play for interactive elements
    if (
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.getAttribute("role") === "button" ||
      target.classList.contains("cursor-pointer")
    ) {
      try {
        uiClickRef.current.currentTime = 0
        uiClickRef.current.play().catch(() => {})
      } catch (error) {
        console.error("Error playing click sound:", error)
      }
    }
  }

  // Add hover sound effect
  useEffect(() => {
    if (typeof document === "undefined") return

    const handleMouseEnter = (e: MouseEvent) => {
      if (!hoverRef.current) return

      const target = e.target as HTMLElement

      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer")
      ) {
        try {
          hoverRef.current.currentTime = 0
          hoverRef.current.play().catch(() => {})
        } catch (error) {
          console.error("Error playing hover sound:", error)
        }
      }
    }

    document.addEventListener("mouseenter", handleMouseEnter, true)

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true)
    }
  }, [])

  return null // This component doesn't render anything
}

