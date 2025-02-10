import fs from "fs"
import bitManipulation from "@secata-public/bitmanipulation-ts"
const { BitOutput } = bitManipulation
import { Client } from "@partisiablockchain/zk-client"
import { BlockchainAddress } from "@partisiablockchain/abi-client"
import {
  Model,
  InternalVertex,
  LeafVertex,
  addModel
} from "./ClassificationCodegen"
import { z } from "zod"
const TESTNET_URL = "https://node1.testnet.partisiablockchain.com"
const CONTRACT_ADDRESS = "03be427dbe748f6e82f16548f28409b18171f09d4d"

export const ModelSchema = z.object({
  internals: z
    .array(
      z.object({
        feature: z.number(),
        threshold: z.number()
      })
    )
    .length(7), // Must have exactly 7 internals
  leaves: z
    .array(
      z.object({
        classification: z.array(z.number())
      })
    )
    .length(8) // Must have exactly 8 leaves
})

// Load & parse model from file
export function serializeJsonModel(
  modelData: unknown
): Uint8Array<ArrayBufferLike> {
  const parsedData = ModelSchema.parse(modelData)

  // Convert to ABI-compatible format
  const jsonModel: Model = {
    internals: parsedData.internals.map(
      (i): InternalVertex => ({
        feature: i.feature,
        threshold: i.threshold
      })
    ),
    leaves: parsedData.leaves.map(
      (l): LeafVertex => ({
        classification: l.classification[0] === 1
      })
    )
  }
  const serializedModel = serializeModel(jsonModel)
  return serializedModel
}

// Serialize your Model
export function serializeModel(modelObj: any): Uint8Array {
  return BitOutput.serializeBits(out => {
    // 7 internals
    for (let i = 0; i < 7; i++) {
      const { feature, threshold } = modelObj.internals[i]
      out.writeUnsignedNumber(feature, 8) // Sbu8
      out.writeSignedNumber(threshold, 16) // Sbi16
    }
    // 8 leaves
    for (let i = 0; i < 8; i++) {
      const classification = modelObj.leaves[i].classification // [8 bits]
      for (let b = 0; b < 8; b++) {
        out.writeBoolean(classification[b] === 1)
      }
    }
  })
}
