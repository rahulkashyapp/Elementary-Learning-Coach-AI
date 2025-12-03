'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StudentData } from '@/app/page'

interface Question {
  id: string
  skill: string
  subject: 'math' | 'english'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface DiagnosticTestProps {
  studentData: StudentData
  onComplete: (updatedData: StudentData) => void
  assessmentAttempt?: number
}

export function DiagnosticTest({ studentData, onComplete, assessmentAttempt = 1 }: DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Array<{
    questionId: string
    selectedAnswer: number
    isCorrect: boolean
    confidence: 'fast' | 'normal' | 'with_hint'
  }>>([])
  const [startTime, setStartTime] = useState<number>(Date.now())

  const generateQuestions = (grade: number): Question[] => {
    const questions: Question[] = []

    // Math questions based on grade
    if (grade >= 1) {
      questions.push({
        id: 'math_place_value_1',
        skill: 'place_value',
        subject: 'math',
        difficulty: 'medium',
        question: `What is the value of 5 in the number 52?`,
        options: ['5 ones', '5 tens', '50 ones', '5 hundreds'],
        correctAnswer: 1,
        explanation: 'In 52, the 5 is in the tens place, so it means 5 tens or 50!'
      })

      questions.push({
        id: 'math_counting_1',
        skill: 'place_value',
        subject: 'math',
        difficulty: 'easy',
        question: `What number comes after 9?`,
        options: ['8', '10', '11', '9'],
        correctAnswer: 1,
        explanation: 'After 9 comes 10! 9, 10, 11... keep counting! 🔢'
      })
    }

    if (grade >= 2) {
      questions.push({
        id: 'math_addition_1',
        skill: 'addition',
        subject: 'math',
        difficulty: 'medium',
        question: `What is 25 + 17?`,
        options: ['32', '42', '52', '62'],
        correctAnswer: 1,
        explanation: '25 + 17 = 42. You can count: 25 + 10 = 35, then +7 = 42!'
      })

      questions.push({
        id: 'math_addition_2',
        skill: 'addition',
        subject: 'math',
        difficulty: 'easy',
        question: `What is 8 + 5?`,
        options: ['12', '13', '14', '15'],
        correctAnswer: 1,
        explanation: '8 + 5 = 13. Count on from 8: 9, 10, 11, 12, 13! 🎯'
      })
    }

    if (grade >= 3) {
      questions.push({
        id: 'math_multiplication_1',
        skill: 'multiplication',
        subject: 'math',
        difficulty: 'medium',
        question: `What is 7 × 8?`,
        options: ['48', '56', '64', '72'],
        correctAnswer: 1,
        explanation: '7 × 8 = 56. Think: 7 groups of 8, or 8 groups of 7! 🎯'
      })

      questions.push({
        id: 'math_fractions_1',
        skill: 'fractions',
        subject: 'math',
        difficulty: 'medium',
        question: `Which shape shows 1/2 shaded?`,
        options: ['🍕 1/4 pizza', '🍕 half pizza', '🍕 3/4 pizza', '🍕 whole pizza'],
        correctAnswer: 1,
        explanation: '1/2 means one part out of two equal parts - exactly half! 🍕'
      })

      questions.push({
        id: 'math_subtraction_1',
        skill: 'subtraction',
        subject: 'math',
        difficulty: 'medium',
        question: `What is 45 - 18?`,
        options: ['27', '37', '33', '29'],
        correctAnswer: 0,
        explanation: '45 - 18 = 27. Take away 10 first (35), then 8 more (27)! 🎈'
      })
    }

    if (grade >= 4) {
      questions.push({
        id: 'math_decimals_1',
        skill: 'decimals',
        subject: 'math',
        difficulty: 'medium',
        question: `Which is bigger: 0.5 or 0.75?`,
        options: ['0.5', '0.75', 'They are equal', 'Cannot tell'],
        correctAnswer: 1,
        explanation: '0.75 is bigger because 75 hundredths is more than 50 hundredths! 📊'
      })

      questions.push({
        id: 'math_division_1',
        skill: 'division',
        subject: 'math',
        difficulty: 'medium',
        question: `What is 24 ÷ 6?`,
        options: ['3', '4', '6', '8'],
        correctAnswer: 1,
        explanation: '24 ÷ 6 = 4. 6 groups of 4 make 24, or 24 divided into 6 equal parts is 4! 🍰'
      })
    }

    // English questions based on grade
    if (grade >= 1) {
      questions.push({
        id: 'english_phonics_1',
        skill: 'phonics',
        subject: 'english',
        difficulty: 'medium',
        question: `Which word starts with the 'c' sound like in 'cat'?`,
        options: ['Dog', 'Car', 'Ball', 'House'],
        correctAnswer: 1,
        explanation: 'Car starts with the "c" sound, just like cat! Cuh-Cuh-Car! 🚗'
      })

      questions.push({
        id: 'english_alphabet_1',
        skill: 'phonics',
        subject: 'english',
        difficulty: 'easy',
        question: `Which letter comes after B in the alphabet?`,
        options: ['A', 'C', 'D', 'E'],
        correctAnswer: 1,
        explanation: 'A, B, C... C comes after B! Great job! 📝'
      })
    }

    if (grade >= 2) {
      questions.push({
        id: 'english_sight_words_1',
        skill: 'sight_words',
        subject: 'english',
        difficulty: 'medium',
        question: `Which word means 'the opposite of big'?`,
        options: ['Large', 'Small', 'Tall', 'Wide'],
        correctAnswer: 1,
        explanation: 'Small means little - the opposite of big! Great job! 🐘🐁'
      })

      questions.push({
        id: 'english_rhyming_1',
        skill: 'phonics',
        subject: 'english',
        difficulty: 'easy',
        question: `Which word rhymes with 'sun'?`,
        options: ['Moon', 'Run', 'Fun', 'Cat'],
        correctAnswer: 1,
        explanation: 'Sun and run both end with "un" sound! Great rhyming! ☀️🏃'
      })
    }

    if (grade >= 3) {
      questions.push({
        id: 'english_grammar_1',
        skill: 'grammar',
        subject: 'english',
        difficulty: 'medium',
        question: `Which is the correct sentence?`,
        options: [
          'I goes to school',
          'I go to school',
          'I going to school',
          'I went to school everyday'
        ],
        correctAnswer: 1,
        explanation: 'With "I", we say "I go" not "I goes". Remember: I go, you go, we go! 🏫'
      })

      questions.push({
        id: 'english_comprehension_1',
        skill: 'comprehension',
        subject: 'english',
        difficulty: 'medium',
        question: `Tom has a red ball. The ball is big. What color is Tom's ball?`,
        options: ['Blue', 'Big', 'Red', 'Small'],
        correctAnswer: 2,
        explanation: 'The story says Tom has a RED ball! Reading carefully helps! 🔴'
      })
    }

    if (grade >= 4) {
      questions.push({
        id: 'english_vocabulary_1',
        skill: 'reading',
        subject: 'english',
        difficulty: 'medium',
        question: `What does 'enormous' mean?`,
        options: ['Very small', 'Very big', 'Very fast', 'Very slow'],
        correctAnswer: 1,
        explanation: 'Enormous means very, very big! Like an enormous dinosaur! 🦕'
      })

      questions.push({
        id: 'english_grammar_2',
        skill: 'grammar',
        subject: 'english',
        difficulty: 'medium',
        question: `Which sentence is correct?`,
        options: [
          'She don\'t like apples',
          'She doesn\'t like apples',
          'She doesn\'t likes apples',
          'She don\'t likes apples'
        ],
        correctAnswer: 1,
        explanation: 'With she/he/it, we use doesn\'t! She doesn\'t like apples. ✅'
      })
    }

    // Additional mixed questions for all grades
    questions.push({
      id: 'math_patterns_1',
      skill: 'place_value',
      subject: 'math',
      difficulty: 'easy',
      question: `What comes next: 2, 4, 6, 8, ?`,
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Counting by 2s! 2, 4, 6, 8, 10... pattern found! 🔢'
    })

    questions.push({
      id: 'english_spelling_1',
      skill: 'sight_words',
      subject: 'english',
      difficulty: 'medium',
      question: `How do you spell 'because'?`,
      options: ['Becaus', 'Becuse', 'Because', 'Bicos'],
      correctAnswer: 2,
        explanation: 'B-E-C-A-U-S-E! Practice spelling makes perfect! ✍️'
    })

    return questions.slice(0, 12) // Return 12 questions for comprehensive assessment
  }

  const [questions] = useState<Question[]>(generateQuestions(studentData.grade))
  const currentQuestion = questions[currentQuestionIndex]

  const updateMasteryScore = (
    subject: 'math' | 'english',
    skill: string,
    isCorrect: boolean,
    confidence: 'fast' | 'normal' | 'with_hint'
  ) => {
    let change = 0
    if (isCorrect) {
      if (confidence === 'fast') change = 0.30
      else if (confidence === 'normal') change = 0.20
      else change = 0.10
    } else {
      change = confidence === 'with_hint' ? -0.10 : -0.15
    }

    const updatedData = { ...studentData }
    const currentScore = updatedData.masteryScores[subject][skill as keyof typeof updatedData.masteryScores.math]
    updatedData.masteryScores[subject][skill as keyof typeof updatedData.masteryScores.math] = 
      Math.max(0, Math.min(1, currentScore + change))
    
    return updatedData
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const timeTaken = Date.now() - startTime
    const confidence: 'fast' | 'normal' | 'with_hint' = 
      timeTaken < 10000 ? 'fast' : timeTaken < 30000 ? 'normal' : 'with_hint'

    const updatedData = updateMasteryScore(
      currentQuestion.subject,
      currentQuestion.skill,
      isCorrect,
      confidence
    )

    setAnsweredQuestions([...answeredQuestions, {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      confidence
    }])

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setStartTime(Date.now())
    } else {
      onComplete(studentData)
    }
  }

  const progress = ((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-purple-700">
                📝 Assessment Test
              </CardTitle>
              <CardDescription>
                Attempt #{assessmentAttempt} • {studentData.name} • Grade {studentData.grade}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-100 text-blue-800">
                {assessmentAttempt === 1 ? 'First Time' : `Attempt ${assessmentAttempt}`}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showExplanation ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">
                  📝 Question:
                </h3>
                <p className="text-lg">{currentQuestion.question}</p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full text-left justify-start p-4 h-auto ${
                      selectedAnswer === index ? 'bg-purple-600 text-white' : 'hover:bg-purple-50'
                    }`}
                    onClick={() => setSelectedAnswer(index)}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                Submit Answer ✅
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                answeredQuestions[answeredQuestions.length - 1]?.isCorrect 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {answeredQuestions[answeredQuestions.length - 1]?.isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {answeredQuestions[answeredQuestions.length - 1]?.isCorrect 
                      ? 'Correct! Well done!' 
                      : 'Not quite right, but good try!'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </div>

              <Button
                onClick={handleNextQuestion}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Test 🎉'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}