import { CryptoUtils } from "@partisiablockchain/zk-client"
import { CompactBitArray } from "@secata-public/bitmanipulation-ts"
import { SenderAuthenticationKeyPair } from "@partisiablockchain/blockchain-api-transaction-client"

function formatVarId(varId: number): string {
  const hex = varId.toString(16).padStart(8, "0")
  return "0x" + hex
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
  realClient: any,
  txIdentifier: string,
  finalVarId: number,
  pollInterval = 5000,
  timeout = 60000
): Promise<number[]> {
  const finalVarIdStr = formatVarId(finalVarId)
  console.log("Polling for final secret variable with ID:", finalVarIdStr)
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const owner = CryptoUtils.privateKeyToKeypair(
      process.env.PARTI_PRIVATE_KEY!
    )
    // Pass the final variable id as a hex string
    const reconstructedSecret: any = await realClient.fetchSecretVariable(
      new SenderAuthenticationKeyPair(owner),
      finalVarIdStr
    )

    console.log(
      "Reconstructed secret data (hex):",
      Buffer.from(reconstructedSecret.data).toString("hex")
    )
    console.log("Bit length:", reconstructedSecret.length)
    console.log("Data length (bytes):", reconstructedSecret.data.length)

    if (reconstructedSecret.data && reconstructedSecret.data.length > 0) {
      const finalBytes = reconstructedSecret.data.slice(
        reconstructedSecret.data.length - 8
      )
      const oneHot: number[] = []
      for (let i = 0; i < finalBytes.length; i++) {
        oneHot.push(finalBytes[i] === 1 ? 1 : 0)
      }
      console.log("Extracted final one-hot vector:", oneHot)
      return oneHot
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
  throw new Error("Timed out waiting for secret output")
}

/**
 * This helper takes the spawned events from waitForSpawnedEvents
 * and attempts to locate the compute_complete event (shortname "42").
 * It returns the variable ID (as a number) from that event.
 */
export async function getFinalResultVarIdFromEvents(
  eventsObj: any
): Promise<number> {
  console.log("Events received:", eventsObj)
  if (!eventsObj.events || eventsObj.events.length === 0) {
    throw new Error("No events found in the transaction")
  }

  // For this example, take the first event.
  const computeEvent = eventsObj.events[0]
  console.log("Using event:", computeEvent)

  const { candidateFromContent, candidateFromIdentifier } =
    extractCandidateVarIds(computeEvent)

  // For example, try candidate from identifier first.
  // (You can change this logic based on your testing.)
  const finalCandidate = candidateFromIdentifier
  console.log("Using final candidate variable ID:", finalCandidate)
  return finalCandidate
}

export function extractCandidateVarIds(event: any): {
  candidateFromContent: number
  candidateFromIdentifier: number
} {
  // Candidate from event.content: decode base64, take first 4 bytes as uint32 (big-endian)
  const decodedHex = Buffer.from(event.content, "base64").toString("hex")
  const candidateFromContent = parseInt(decodedHex.slice(0, 8), 16)

  // Candidate from event.identifier: take first 8 hex digits
  const candidateFromIdentifier = parseInt(event.identifier.slice(0, 8), 16)

  console.log("Candidate from event.content:", candidateFromContent)
  console.log("Candidate from event.identifier:", candidateFromIdentifier)

  return { candidateFromContent, candidateFromIdentifier }
}

export function extractFinalOneHot(data: Uint8Array): number[] {
  // Log all bytes for debugging.
  console.log("Full secret data (hex):", Buffer.from(data).toString("hex"))
  console.log("Data length (bytes):", data.length)

  // Assume final predicted_class is in the last 8 bytes.
  const finalBytes = data.slice(data.length - 8)
  const oneHot: number[] = []
  for (let i = 0; i < finalBytes.length; i++) {
    // Here we expect that a true Sbu1 is encoded exactly as 1.
    oneHot.push(finalBytes[i] === 1 ? 1 : 0)
  }
  console.log("Extracted final one-hot vector:", oneHot)
  return oneHot
}
