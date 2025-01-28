// pages/api/result/[varId].ts
import type { NextApiRequest, NextApiResponse } from "next"
import {
  ZkSecretReader,
  CryptoUtils,
  SignatureProviderKeyPair
} from "@partisiablockchain/zk-client"

const PRIVATE_KEY = process.env.PARTISIA_PRIVATE_KEY || "0x..."

export default async function getResultHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed")
    }
    const { varId } = req.query
    if (!varId) return res.status(400).json({ error: "Missing varId" })

    // 1) Construct a secret reader (the actual code depends on your library)
    const keyPair = CryptoUtils.privateKeyToKeypair(PRIVATE_KEY)
    const signatureProvider = new SignatureProviderKeyPair(keyPair)

    // Example usage
    const secretReader = new ZkSecretReader(/* pass node info, etc. */)
    const resultBits = await secretReader.fetchSecretVariable(
      signatureProvider,
      parseInt(varId as string)
    )

    // If your contract returns [Sbu1; 8], you'll get 8 bits. Convert them into an index
    // or an array. This might require custom logic depending on how the library returns it.
    // For example, if it's a "BitArray":
    const bytes = resultBits.toBytes() // if your version has that or something similar
    // interpret that as a single byte with 8 bits.

    // find index of '1'
    const byte = bytes[0]
    const index =
      byte & 0x01
        ? 0
        : byte & 0x02
          ? 1
          : byte & 0x04
            ? 2
            : byte & 0x08
              ? 3
              : byte & 0x10
                ? 4
                : byte & 0x20
                  ? 5
                  : byte & 0x40
                    ? 6
                    : byte & 0x80
                      ? 7
                      : -1

    res.status(200).json({ personalityIndex: index })
  } catch (err) {
    console.error("Error fetching result:", err)
    res.status(500).json({ error: String(err) })
  }
}
