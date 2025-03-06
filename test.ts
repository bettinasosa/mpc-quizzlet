interface InternalVertex {
  feature: number
  threshold: number
}

interface LeafVertex {
  classification: number[]
}

interface Model {
  internals: InternalVertex[]
  leaves: LeafVertex[]
}

function evaluateInternalVertices(model: Model, sample: number[]): boolean[] {
  if (sample.length !== 10) {
    throw new Error("Sample must have 10 answers.")
  }
  return model.internals.map(internal => {
    const value = sample[internal.feature]
    return value <= internal.threshold
  })
}

function evaluatePaths(vertexEvaluation: boolean[]): boolean[] {
  if (vertexEvaluation.length !== 7) {
    throw new Error("vertexEvaluation must have length 7.")
  }
  return [
    vertexEvaluation[0] && vertexEvaluation[1] && vertexEvaluation[2],
    vertexEvaluation[0] && vertexEvaluation[1] && !vertexEvaluation[2],
    vertexEvaluation[0] && !vertexEvaluation[1] && vertexEvaluation[3],
    vertexEvaluation[0] && !vertexEvaluation[1] && !vertexEvaluation[3],
    !vertexEvaluation[0] && vertexEvaluation[4] && vertexEvaluation[5],
    !vertexEvaluation[0] && vertexEvaluation[4] && !vertexEvaluation[5],
    !vertexEvaluation[0] && !vertexEvaluation[4] && vertexEvaluation[6],
    !vertexEvaluation[0] && !vertexEvaluation[4] && !vertexEvaluation[6]
  ]
}

function predictClass(pathEvaluation: boolean[], model: Model): number[] {
  const finalClass = new Array(8).fill(0)
  for (let leafIdx = 0; leafIdx < 8; leafIdx++) {
    if (pathEvaluation[leafIdx]) {
      const classification = model.leaves[leafIdx].classification
      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        finalClass[bitIdx] |= classification[bitIdx]
      }
    }
  }
  return finalClass
}

function evaluateModel(model: Model, sample: number[]): number[] {
  const vertexEval = evaluateInternalVertices(model, sample)
  const pathEval = evaluatePaths(vertexEval)
  return predictClass(pathEval, model)
}

const personalityMapping = [
  "HODLer",
  "Degen",
  "NFT Enthusiast",
  "DeFi Expert",
  "Privacy Advocate",
  "Developer",
  "Influencer",
  "Trader"
]

function convertOneHotToPersonality(oneHot: number[]): string {
  const index = oneHot.findIndex(bit => bit === 1)
  return index >= 0 ? personalityMapping[index] : "Unknown"
}

const newModel: Model = {
  internals: [
    { feature: 1, threshold: 2 }, // Q1: if answer 0,1,or 2 → true; only 3 → false.
    { feature: 8, threshold: 2 }, // Q8: similarly, allow a bit more range.
    { feature: 2, threshold: 1 }, // Q2: now true for answers 0 or 1, false for 2 or 3.
    { feature: 7, threshold: 2 }, // Q7: remains as before.
    { feature: 5, threshold: 1 }, // Q5: changed from Q2 to Q5 for variety.
    { feature: 4, threshold: 2 }, // Q4: true for answers 0,1,2.
    { feature: 0, threshold: 2 } // Q0: true for answers 0,1,2.
  ],
  leaves: [
    { classification: [1, 0, 0, 0, 0, 0, 0, 0] }, // Leaf 0: HODLer
    { classification: [0, 1, 0, 0, 0, 0, 0, 0] }, // Leaf 1: Degen
    { classification: [0, 0, 1, 0, 0, 0, 0, 0] }, // Leaf 2: NFT Enthusiast
    { classification: [0, 0, 0, 1, 0, 0, 0, 0] }, // Leaf 3: DeFi Expert
    { classification: [0, 0, 0, 0, 1, 0, 0, 0] }, // Leaf 4: Privacy Advocate
    { classification: [0, 0, 0, 0, 0, 1, 0, 0] }, // Leaf 5: Developer
    { classification: [0, 0, 0, 0, 0, 0, 1, 0] }, // Leaf 6: Influencer
    { classification: [0, 0, 0, 0, 0, 0, 0, 1] } // Leaf 7: Trader
  ]
}

const sampleInputs = [
  {
    description: "All answers 0 (upper branch)",
    sample: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    description: "All answers 3 (lower branch)",
    sample: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
  },
  {
    description: "Mixed answers: try forcing mid-range answers",
    sample: [1, 2, 1, 2, 1, 0, 1, 2, 1, 2]
  },
  {
    description: "Mixed answers: different pattern",
    sample: [2, 1, 2, 1, 3, 2, 0, 1, 2, 0]
  }
]

for (const test of sampleInputs) {
  console.log(`\nTest: ${test.description}`)
  const predictedOneHot = evaluateModel(newModel, test.sample)
  console.log("Predicted one-hot vector:", predictedOneHot)
  const personality = convertOneHotToPersonality(predictedOneHot)
  console.log("Predicted personality:", personality)
}
