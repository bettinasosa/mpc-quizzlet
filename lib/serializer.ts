import { BitOutput } from "@secata-public/bitmanipulation-ts"

export function serializeModel(model: any): Buffer {
  return BitOutput.serializeBits(out => {
    // Serialize internals
    model.internals.forEach((i: any) => {
      out.writeUInt8(i.feature) // Sbu8
      out.writeInt16(i.threshold) // Sbi16
    })

    // Serialize leaves
    model.leaves.forEach((l: any) => {
      l.classification.forEach((bit: number) => {
        out.writeBit(bit === 1) // Sbu1
      })
    })
  })
}
