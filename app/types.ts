export interface Question {
  question_id: number
  text: string
  answers: string[]
  icon?: string
}

export interface PersonalityResult {
  type: string
  description: string
  traits: string[]
  image: string
}

export type AnswerData = number[]
