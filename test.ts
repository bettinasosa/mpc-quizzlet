interface InternalVertex {
  feature: number // unsigned 8-bit (0-255)
  threshold: number // signed 16-bit (-32768 to 32767)
}

interface LeafVertex {
  classification: number[] // one-hot array of length 8 (each element 0 or 1)
}

interface Model {
  internals: InternalVertex[]
  leaves: LeafVertex[]
}

interface Sample {
  values: number[] // length must be 10, each value assumed to be in range 0–3
}

// Mimic lookup_in_sbi8_array: simply return sample[feature] (assuming feature is in range)
function lookupInSample(sample: number[], feature: number): number {
  if (feature < 0 || feature >= sample.length) {
    throw new Error("Feature index out of range")
  }
  return sample[feature]
}

// Evaluate each internal vertex: if sample value at [feature] <= threshold then true, else false.
function evaluateInternalVertices(
  internals: InternalVertex[],
  sample: number[]
): boolean[] {
  const evaluations: boolean[] = []
  for (let i = 0; i < internals.length; i++) {
    const internal = internals[i]
    const value = lookupInSample(sample, internal.feature)
    // Here the condition is: value <= threshold
    const result = value <= internal.threshold
    evaluations.push(result)
  }
  return evaluations
}

// Given the 7 boolean evaluations, compute the 8 path evaluations as per the Rust logic.
function evaluatePaths(vertexEval: boolean[]): boolean[] {
  if (vertexEval.length !== 7) {
    throw new Error("Expected 7 internal vertex evaluations")
  }
  return [
    vertexEval[0] && vertexEval[1] && vertexEval[2],
    vertexEval[0] && vertexEval[1] && !vertexEval[2],
    vertexEval[0] && !vertexEval[1] && vertexEval[3],
    vertexEval[0] && !vertexEval[1] && !vertexEval[3],
    !vertexEval[0] && vertexEval[4] && vertexEval[5],
    !vertexEval[0] && vertexEval[4] && !vertexEval[5],
    !vertexEval[0] && !vertexEval[4] && vertexEval[6],
    !vertexEval[0] && !vertexEval[4] && !vertexEval[6]
  ]
}

// Given the active paths and the model leaves, combine them to produce the final predicted one-hot vector.
// This mimics the predict_class function in Rust.
function predictClass(paths: boolean[], leaves: LeafVertex[]): number[] {
  const finalClass = Array(8).fill(0)
  for (let leafIdx = 0; leafIdx < leaves.length; leafIdx++) {
    if (paths[leafIdx]) {
      const classification = leaves[leafIdx].classification
      // For each bit, perform logical OR between current finalClass and the leaf classification
      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        // Since these are booleans stored as 0 or 1, we can use OR
        finalClass[bitIdx] = finalClass[bitIdx] || classification[bitIdx]
      }
    }
  }
  return finalClass
}

// Combine all steps: evaluate internals, compute paths, then predict final class.
function evaluateModel(model: Model, sample: Sample): number[] {
  const vertexEval = evaluateInternalVertices(model.internals, sample.values)
  console.log("Internal evaluations:", vertexEval)

  const paths = evaluatePaths(vertexEval)
  console.log("Path evaluations:", paths)

  const predicted = predictClass(paths, model.leaves)
  return predicted
}

/* --- Example JSON Model --- 
   This is an example model.
   NOTE: Thresholds must be chosen in the range of sample answers (0–3).
*/
const model: Model = {
  internals: [
    { feature: 0, threshold: 1 }, // Q0: if answer is 0 or 1 => true, else false
    { feature: 1, threshold: 0 }, // Q1: only answer 0 => true
    { feature: 2, threshold: 1 }, // Q2: 0 or 1 => true; 2 or 3 => false
    { feature: 9, threshold: 1 }, // Q9: if answer is 0 or 1 => true; 2 or 3 => false
    { feature: 3, threshold: 1 }, // Q3: 0 or 1 => true; 2 or 3 => false
    { feature: 5, threshold: 1 }, // Q5: 0 or 1 => true; 2 or 3 => false
    { feature: 6, threshold: 1 } // Q6: 0 or 1 => true; 2 or 3 => false
  ],
  leaves: [
    { classification: [0, 1, 0, 0, 0, 0, 0, 0] }, // Leaf 0: Degen
    { classification: [1, 0, 0, 0, 0, 0, 0, 0] }, // Leaf 1: HODLer
    { classification: [0, 0, 1, 0, 0, 0, 0, 0] }, // Leaf 2: NFT Enthusiast
    { classification: [0, 0, 0, 1, 0, 0, 0, 0] }, // Leaf 3: DeFi Expert
    { classification: [0, 0, 0, 0, 1, 0, 0, 0] }, // Leaf 4: Privacy Advocate
    { classification: [0, 0, 0, 0, 0, 1, 0, 0] }, // Leaf 5: Developer
    { classification: [0, 0, 0, 0, 0, 0, 1, 0] }, // Leaf 6: Influencer
    { classification: [0, 0, 0, 0, 0, 0, 0, 1] } // Leaf 7: Trader
  ]
}

// --- Test with Sample Inputs ---
// Sample 1: All answers 0
const sample1: Sample = { values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
// Sample 2: All answers 3
const sample2: Sample = { values: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3] }
// Sample 3: All answers 1
const sample3: Sample = { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }
// Sample 4: All answers 2
const sample4: Sample = { values: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2] }

console.log("Sample 1 result (all 0s):", evaluateModel(model, sample1))
console.log("Sample 2 result (all 3s):", evaluateModel(model, sample2))
console.log("Sample 3 result (all 1s):", evaluateModel(model, sample3))
console.log("Sample 4 result (all 2s):", evaluateModel(model, sample4))
