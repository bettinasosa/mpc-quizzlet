import {
  CryptoUtils,
  SignatureProviderKeyPair
} from "@partisiablockchain/zk-client"
import { CompactBitArray } from "@secata-public/bitmanipulation-ts"

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
    // Reconstruct the secret using your private key.
    const owner = CryptoUtils.privateKeyToKeypair(
      process.env.PARTI_PRIVATE_KEY!
    )
    const reconstructedSecret: CompactBitArray =
      await realClient.fetchSecretVariable(
        new SignatureProviderKeyPair(owner),
        1
      )

    // Ensure we have data.
    const data = reconstructedSecret.data
    if (!data || data.length === 0) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))
      continue
    }

    // Assume the one-hot encoding is stored in the first byte.
    const firstByte = data[0]
    const oneHotArray: number[] = []
    for (let i = 0; i < 8; i++) {
      oneHotArray.push((firstByte >> i) & 1)
    }
    console.log("oneHotArray:", oneHotArray)

    // If the array has exactly one bit set, consider it valid.
    if (oneHotArray.filter(bit => bit === 1).length === 1) {
      return oneHotArray
    }

    // Wait before polling again.
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
  throw new Error("Timed out waiting for secret output")
}
