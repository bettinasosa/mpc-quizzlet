import QuizQuestion from "./QuizQuestion"

interface QuizPageProps {
  questions: Record<string, { text: string; answers: string[] }>
  currentPage: number
  answers: number[]
  onAnswer: (questionIndex: number, answerIndex: number) => void
}

export default function QuizPage({
  questions,
  currentPage,
  answers,
  onAnswer
}: QuizPageProps) {
  const startIndex = currentPage * 5
  const pageQuestions = Object.entries(questions).slice(
    startIndex,
    startIndex + 5
  )

  return (
    <div className="space-y-6">
      {pageQuestions.map(([index, question], i) => (
        <QuizQuestion
          key={index}
          question={question}
          selectedAnswer={answers[Number.parseInt(index)]}
          onAnswer={answerIndex =>
            onAnswer(Number.parseInt(index), answerIndex)
          }
          questionIndex={0}
          isCurrent={false}
        />
      ))}
    </div>
  )
}
