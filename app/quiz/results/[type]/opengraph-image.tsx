import { ImageResponse } from "next/og"
import { personalityData } from "@/lib/personality-data"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const type = decodeURIComponent(params.type)
    const personality = personalityData[type as keyof typeof personalityData]

    if (!personality) {
      return new ImageResponse(
        <div
          style={{
            fontSize: 48,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Personality type not found
        </div>,
        {
          width: 1200,
          height: 630,
        },
      )
    }

    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: "bold", marginBottom: 32 }}>I am a {type}</div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          {personality.traits.map((trait, i) => (
            <div
              key={i}
              style={{
                background: "black",
                color: "white",
                padding: "12px 24px",
                fontSize: 24,
              }}
            >
              {trait}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 32, marginBottom: 48, textAlign: "center" }}>
          Discover your crypto personality with the AI-powered quiz by Partisia Blockchain
        </div>

        <div style={{ fontSize: 24, fontWeight: "bold" }}>crypto-personality-quiz.vercel.app</div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.log(`${e}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

