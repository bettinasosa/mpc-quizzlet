import {
  AbiBitOutput,
  AbiByteInput,
  AbiByteOutput,
  AbiInput,
  AbiOutput,
  BlockchainAddress,
  BlockchainStateClient,
  StateWithClient,
  SecretInputBuilder
} from "@partisiablockchain/abi-client"
import { CompactBitArray } from "@secata-public/bitmanipulation-ts"

type Option<K> = K | undefined
export class ClassificationCodegen {
  private readonly _client: BlockchainStateClient | undefined
  private readonly _address: BlockchainAddress | undefined

  public constructor(
    client: BlockchainStateClient | undefined,
    address: BlockchainAddress | undefined
  ) {
    this._address = address
    this._client = client
  }
  public deserializeContractState(_input: AbiInput): ContractState {
    const modelOwner: BlockchainAddress = _input.readAddress()
    return { modelOwner }
  }
  public async getState(): Promise<ContractState> {
    const bytes = await this._client?.getContractStateBinary(this._address!)
    if (bytes === undefined) {
      throw new Error("Unable to get state bytes")
    }
    const input = AbiByteInput.createLittleEndian(bytes)
    return this.deserializeContractState(input)
  }
}
export interface ContractState {
  modelOwner: BlockchainAddress
}

export interface Model {
  internals: InternalVertex[]
  leaves: LeafVertex[]
}
function serializeModel(_out: AbiOutput, _value: Model): void {
  const { internals, leaves } = _value
  if (internals.length !== 7) {
    throw new Error("Length of internals does not match expected 7")
  }
  for (const internals_arr of internals) {
    serializeInternalVertex(_out, internals_arr)
  }
  if (leaves.length !== 8) {
    throw new Error("Length of leaves does not match expected 8")
  }
  for (const leaves_arr of leaves) {
    serializeLeafVertex(_out, leaves_arr)
  }
}

export interface InternalVertex {
  feature: number
  threshold: number
}
function serializeInternalVertex(
  _out: AbiOutput,
  _value: InternalVertex
): void {
  const { feature, threshold } = _value
  _out.writeU8(feature)
  _out.writeI16(threshold)
}

export interface LeafVertex {
  classification: (0 | 1)[]
}

function serializeLeafVertex(_out: AbiOutput, _value: LeafVertex): void {
  const { classification } = _value
  if (classification.length !== 8) {
    throw new Error("Leaf classification must have 8 bits.")
  }
  for (const bit of classification) {
    // If your Rust is truly [Sbu1; 8], you should do:
    _out.writeU8(bit)
    // or if it expects single bits, do `_out.writeBoolean(bit === 1)`.
  }
}

export interface SecretVarId {
  rawId: number
}
function serializeSecretVarId(_out: AbiOutput, _value: SecretVarId): void {
  const { rawId } = _value
  _out.writeU32(rawId)
}

export interface Sample {
  values: number[]
}
function serializeSample(_out: AbiOutput, _value: Sample): void {
  const { values } = _value
  if (values.length !== 10) {
    throw new Error("Length of values does not match expected 10")
  }
  for (const values_arr of values) {
    _out.writeI16(values_arr)
  }
}

export function initialize(): Buffer {
  return AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("ffffffff0f", "hex"))
  })
}

export function addModel(
  scalingConversion: number[]
): SecretInputBuilder<Model> {
  const _publicRpc: Buffer = AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("40", "hex"))
    _out.writeI32(scalingConversion.length)
    for (const scalingConversion_vec of scalingConversion) {
      _out.writeU16(scalingConversion_vec)
    }
  })
  const _secretInput = (secret_input_lambda: Model): CompactBitArray =>
    AbiBitOutput.serialize(_out => {
      serializeModel(_out, secret_input_lambda)
    })
  return new SecretInputBuilder<Model>(_publicRpc, _secretInput)
}

export function addInputSample(
  modelId: SecretVarId,
  resultReceiver: BlockchainAddress
): SecretInputBuilder<Sample> {
  const _publicRpc: Buffer = AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("41", "hex"))
    serializeSecretVarId(_out, modelId)
    _out.writeAddress(resultReceiver)
  })
  const _secretInput = (secret_input_lambda: Sample): CompactBitArray =>
    AbiBitOutput.serialize(_out => {
      serializeSample(_out, secret_input_lambda)
    })
  return new SecretInputBuilder<Sample>(_publicRpc, _secretInput)
}

export function deserializeState(state: StateWithClient): ContractState
export function deserializeState(bytes: Buffer): ContractState
export function deserializeState(
  bytes: Buffer,
  client: BlockchainStateClient,
  address: BlockchainAddress
): ContractState
export function deserializeState(
  state: Buffer | StateWithClient,
  client?: BlockchainStateClient,
  address?: BlockchainAddress
): ContractState {
  if (Buffer.isBuffer(state)) {
    const input = AbiByteInput.createLittleEndian(state)
    return new ClassificationCodegen(client, address).deserializeContractState(
      input
    )
  } else {
    const input = AbiByteInput.createLittleEndian(state.bytes)
    return new ClassificationCodegen(
      state.client,
      state.address
    ).deserializeContractState(input)
  }
}
