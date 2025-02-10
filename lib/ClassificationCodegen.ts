// This file is auto-generated from an abi-file using AbiCodegen.
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

export class ClassificationTree {
  private readonly _client: BlockchainStateClient | undefined
  private readonly _address: BlockchainAddress | undefined

  public constructor(
    client: BlockchainStateClient | undefined,
    address: BlockchainAddress | undefined
  ) {
    this._address = address
    this._client = client
  }

  // Deserialize the contract's state from binary format
  public deserializeContractState(_input: AbiInput): ContractState {
    const modelOwner: BlockchainAddress = _input.readAddress()
    return { modelOwner }
  }

  // Get the current state of the contract
  public async getState(): Promise<ContractState> {
    const bytes = await this._client?.getContractStateBinary(this._address!)
    if (bytes === undefined) {
      throw new Error("Unable to get state bytes")
    }
    const input = AbiByteInput.createLittleEndian(bytes)
    return this.deserializeContractState(input)
  }
}

// Interface representing the contract's state
export interface ContractState {
  modelOwner: BlockchainAddress
}

// Interface for the decision tree model structure
export interface Model {
  internals: InternalVertex[] // Internal nodes (7 required)
  leaves: LeafVertex[] // Leaf nodes (8 required)
}

// Function to serialize a Model into binary format
function serializeModel(_out: AbiOutput, _value: Model): void {
  const { internals, leaves } = _value
  // Validate internal nodes count
  if (internals.length !== 7) {
    throw new Error("Length of internals does not match expected 7")
  }
  // Serialize each internal node
  for (const internals_arr of internals) {
    serializeInternalVertex(_out, internals_arr)
  }
  // Validate leaf nodes count
  if (leaves.length !== 8) {
    throw new Error("Length of leaves does not match expected 8")
  }
  // Serialize each leaf node
  for (const leaves_arr of leaves) {
    serializeLeafVertex(_out, leaves_arr)
  }
}

// Interface for internal nodes of the decision tree
export interface InternalVertex {
  feature: number // Which feature to test (0-255)
  threshold: number // Threshold value for the feature (-32768 to 32767)
}

// Function to serialize an internal vertex
function serializeInternalVertex(
  _out: AbiOutput,
  _value: InternalVertex
): void {
  const { feature, threshold } = _value
  _out.writeU8(feature) // Write feature as unsigned 8-bit int
  _out.writeI16(threshold) // Write threshold as signed 16-bit int
}

// Interface for leaf nodes of the decision tree
export interface LeafVertex {
  classification: (1 | 0)[] // The classification result
}

// Function to serialize a leaf vertex
function serializeLeafVertex(_out: AbiOutput, _value: LeafVertex): void {
  const { classification } = _value

  // Ensure classification is length 8
  if (classification.length !== 8) {
    throw new Error("Leaf classification must have 8 elements.")
  }

  // Write each bit as a U8: 0 or 1
  for (const bit of classification) {
    // If classification array is [0,1,1,0,...], just write them directly
    _out.writeU8(bit ? 1 : 0)
  }
}

// Interface for secret variable IDs
export interface SecretVarId {
  rawId: number
}

// serialize a secret variable ID
function serializeSecretVarId(_out: AbiOutput, _value: SecretVarId): void {
  const { rawId } = _value
  _out.writeU32(rawId) // Write ID as unsigned 32-bit int
}

export interface Sample {
  values: number[] // Array of feature values
}

// serialize an input sample
function serializeSample(_out: AbiOutput, _value: Sample): void {
  const { values } = _value
  if (values.length !== 10) {
    throw new Error("Length of values does not match expected 10")
  }
  for (const values_arr of values) {
    _out.writeI16(values_arr) // Write each value as signed 16-bit int
  }
}

// initialize the contract
export function initialize(): Buffer {
  return AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("ffffffff0f", "hex"))
  })
}

// create a transaction for adding a model
// This is the main function you'll use when uploading a model
export function addModel(
  scalingConversion: number[]
): SecretInputBuilder<Model> {
  // Create the public part of the transaction
  const _publicRpc: Buffer = AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("40", "hex")) // Function identifier
    _out.writeI32(scalingConversion.length) // Write array length
    for (const scalingConversion_vec of scalingConversion) {
      _out.writeU16(scalingConversion_vec) // Write each scaling factor
    }
  })

  // Create the secret part of the transaction
  const _secretInput = (secret_input_lambda: Model): CompactBitArray =>
    AbiBitOutput.serialize(_out => {
      serializeModel(_out, secret_input_lambda)
    })

  return new SecretInputBuilder<Model>(_publicRpc, _secretInput)
}

// Function to create a transaction for adding an input sample for classification
export function addInputSample(
  modelId: SecretVarId,
  resultReceiver: BlockchainAddress
): SecretInputBuilder<Sample> {
  // Create the public part of the transaction
  const _publicRpc: Buffer = AbiByteOutput.serializeBigEndian(_out => {
    _out.writeBytes(Buffer.from("41", "hex")) // Function identifier
    serializeSecretVarId(_out, modelId) // Write model ID
    _out.writeAddress(resultReceiver) // Write receiver address
  })

  // Create the secret part of the transaction
  const _secretInput = (secret_input_lambda: Sample): CompactBitArray =>
    AbiBitOutput.serialize(_out => {
      serializeSample(_out, secret_input_lambda)
    })

  // Return the transaction builder
  return new SecretInputBuilder<Sample>(_publicRpc, _secretInput)
}

// Functions to deserialize contract state from different input types
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
    return new ClassificationTree(client, address).deserializeContractState(
      input
    )
  } else {
    const input = AbiByteInput.createLittleEndian(state.bytes)
    return new ClassificationTree(
      state.client,
      state.address
    ).deserializeContractState(input)
  }
}
