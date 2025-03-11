import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Partisia MPC AI PoC",
  description: "Created with Partisia",
  generator: "@bettsosu"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
