import {
  CryptoUtils,
  SignatureProviderKeyPair
} from "@partisiablockchain/zk-client"
import { CompactBitArray } from "@secata-public/bitmanipulation-ts"

/**
 * Helper: scans a Uint8Array (the raw secret data) and returns the first valid one-hot vector.
 * A valid one-hot vector is an array of 8 numbers (0 or 1) with exactly one '1'.
 */
function extractValidOneHot(data: Uint8Array): number[] | null {
  for (let j = 0; j < data.length; j++) {
    const byte = data[j]
    const bits: number[] = []
    for (let i = 0; i < 8; i++) {
      bits.push((byte >> i) & 1)
    }
    // Check if exactly one bit is set
    if (bits.filter(bit => bit === 1).length === 1) {
      return bits
    }
  }
  return null
}

/**
 * Polls for the secret output associated with a transaction identifier.
 * This function repeatedly checks (every pollInterval milliseconds) whether
 * the secret output is available, timing out after the specified timeout.
 *
 * @param realClient - The RealZkClient instance.
 * @param txIdentifier - The transaction identifier to query.
 * @param pollInterval - Milliseconds between polls (default: 5000).
 * @param timeout - Maximum waiting time in milliseconds (default: 60000).
 * @returns A promise that resolves with the secret output as an array of 8 numbers.
 * @throws if the secret output is not available before timeout.
 */
export async function pollForSecretOutput(
  realClient: any, // adjust type as needed
  txIdentifier: string,
  pollInterval = 5000,
  timeout = 60000
): Promise<number[]> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const owner = CryptoUtils.privateKeyToKeypair(
      process.env.PARTI_PRIVATE_KEY!
    )
    // Call fetchSecretVariable with a SignatureProviderKeyPair and the secret variable index (here: 1)
    const reconstructedSecret: CompactBitArray =
      await realClient.fetchSecretVariable(
        new SignatureProviderKeyPair(owner),
        1
      )

    const data = reconstructedSecret.data
    console.log("Raw secret data (hex):", Buffer.from(data).toString("hex"))

    if (data && data.length > 0) {
      const lastByte = data[data.length - 1]
      const oneHotArray: number[] = []
      for (let i = 0; i < 8; i++) {
        oneHotArray.push((lastByte >> i) & 1)
      }
      console.log("One-hot from last byte:", oneHotArray)
    }

    if (data && data.length > 0) {
      const oneHot = extractValidOneHot(data)
      if (oneHot) {
        console.log("Extracted one-hot vector:", oneHot)
        return oneHot
      }
    }
    // Wait before polling again.
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
  throw new Error("Timed out waiting for secret output")
}
