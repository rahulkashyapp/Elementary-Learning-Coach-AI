'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StudentData } from '@/app/page'

interface DailyPlanProps {
  studentData: StudentData
  onBack: () => void
}

export function DailyPlan({ studentData, onBack }: DailyPlanProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const getWeakSkills = () => {
    const weakSkills: Array<{ subject: string; skill: string; score: number }> = []
    
    Object.entries(studentData.masteryScores.math).forEach(([skill, score]) => {
      if (score < 0.7) {
        weakSkills.push({ subject: 'Math', skill: skill.replace('_', ' '), score })
      }
    })
    
    Object.entries(studentData.masteryScores.english).forEach(([skill, score]) => {
      if (score < 0.7) {
        weakSkills.push({ subject: 'English', skill: skill.replace('_', ' '), score })
      }
    })
    
    return weakSkills.sort((a, b) => a.score - b.score)
  }

  const weakSkills = getWeakSkills()
  const focusSkill = weakSkills[0] || { subject: 'Math', skill: 'addition', score: 0.5 }

  const generateWarmup = () => {
    if (focusSkill.subject === 'Math') {
      return {
        title: '🔢 Math Warm-up',
        activities: [
          'Count from 1 to 20 aloud',
          'Show 5 fingers and count down',
          'Quick: What comes after 7? After 12?'
        ]
      }
    } else {
      return {
        title: '📚 English Warm-up',
        activities: [
          'Say the alphabet A-Z',
          'Name 3 animals that start with B',
          'What rhymes with "cat"?'
        ]
      }
    }
  }

  const generateMicroLesson = () => {
    if (focusSkill.skill.includes('addition')) {
      return {
        title: '🧮 Addition Made Easy',
        explanation: 'Addition is like putting things together! If you have 2 apples and get 3 more, you have 5 apples total!',
        examples: [
          '2 + 3 = 5 (🍎 + 🍎 = 🍎🍎🍎)',
          '4 + 1 = 5 (🚌 + 🚌 = 🚌🚌🚌🚌🚌)',
          'You can count on your fingers!'
        ]
      }
    } else if (focusSkill.skill.includes('phonics')) {
      return {
        title: '🔤 Phonics Fun',
        explanation: 'Phonics helps us read! Each letter makes a special sound.',
        examples: [
          'C says "kuh" like in Cat, Car, Cup',
          'A says "a" like in Apple, Ant, Arrow',
          'T says "tuh" like in Tiger, Top, Ten'
        ]
      }
    } else {
      return {
        title: '🌟 Learning Time',
        explanation: `Today we're learning about ${focusSkill.skill}!`,
        examples: [
          'Let\'s take it step by step',
          'Practice makes perfect',
          'You can do it!'
        ]
      }
    }
  }

  const generatePractice = () => {
    if (focusSkill.skill.includes('addition')) {
      return {
        title: '✏️ Practice Time',
        questions: [
          { question: '3 + 2 = ?', answer: '5', hint: 'Use your fingers!' },
          { question: '4 + 1 = ?', answer: '5', hint: 'Count forward from 4' },
          { question: '2 + 2 = ?', answer: '4', hint: 'Double of 2 is 4' },
          { question: '5 + 0 = ?', answer: '5', hint: 'Adding 0 doesn\'t change the number' },
          { question: '1 + 4 = ?', answer: '5', hint: 'Count from 1 to 5' }
        ]
      }
    } else if (focusSkill.skill.includes('phonics')) {
      return {
        title: '🔊 Sound Practice',
        questions: [
          { question: 'Which starts with "m" sound?', answer: 'Moon', hint: 'Mmm-moon' },
          { question: 'Which starts with "s" sound?', answer: 'Sun', hint: 'Sss-sun' },
          { question: 'Which starts with "b" sound?', answer: 'Ball', hint: 'Buh-ball' },
          { question: 'Which starts with "d" sound?', answer: 'Dog', hint: 'Duh-dog' },
          { question: 'Which starts with "f" sound?', answer: 'Fish', hint: 'Fff-fish' }
        ]
      }
    } else {
      return {
        title: '🎯 Practice Questions',
        questions: [
          { question: 'Let\'s practice together!', answer: 'Great job!', hint: 'You\'re doing well!' },
          { question: 'Keep trying your best!', answer: 'Excellent!', hint: 'Believe in yourself!' },
          { question: 'Learning is fun!', answer: 'Wonderful!', hint: 'You\'re amazing!' },
          { question: 'You can do it!', answer: 'Fantastic!', hint: 'Keep going!' },
          { question: 'Almost there!', answer: 'Perfect!', hint: 'You\'re a star!' }
        ]
      }
    }
  }

  const warmup = generateWarmup()
  const microLesson = generateMicroLesson()
  const practice = generatePractice()

  const dailyPlan = [
    {
      id: 'warmup',
      title: warmup.title,
      duration: '2 minutes',
      content: warmup.activities,
      icon: '🔥'
    },
    {
      id: 'lesson',
      title: microLesson.title,
      duration: '3 minutes',
      content: (
        <div className="space-y-3">
          <p className="text-sm">{microLesson.explanation}</p>
          <div className="space-y-2">
            {microLesson.examples.map((example, index) => (
              <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                {example}
              </div>
            ))}
          </div>
        </div>
      ),
      icon: '📖'
    },
    {
      id: 'practice',
      title: practice.title,
      duration: '8 minutes',
      content: (
        <div className="space-y-3">
          {practice.questions.map((q, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{q.question}</p>
                  <p className="text-xs text-gray-600">Hint: {q.hint}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setCompletedSteps([...completedSteps, index])
                  }}
                  className="ml-2"
                >
                  Check
                </Button>
              </div>
              {completedSteps.includes(index) && (
                <div className="mt-2 text-green-600 text-sm font-medium">
                  ✅ {q.answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      ),
      icon: '✏️'
    },
    {
      id: 'parent',
      title: '👨‍👩‍👧‍👦 Parent Note',
      duration: '1 minute',
      content: (
        <div className="space-y-2 text-sm">
          <p className="font-medium">Today's focus: {focusSkill.skill}</p>
          <p>Please help your child focus on {focusSkill.skill} today.</p>
          <p>Praise effort, not just results! Encourage their hard work!</p>
        </div>
      ),
      icon: '📝'
    }
  ]

  const currentStepData = dailyPlan[currentStep]

  const handleNext = () => {
    if (currentStep < dailyPlan.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-700">
                📅 Today's Learning Plan
              </CardTitle>
              <CardDescription>
                Personalized for {studentData.name} • Grade {studentData.grade} • {studentData.studyTimePerDay} minutes
              </CardDescription>
            </div>
            <Button onClick={onBack} variant="outline">
              ← Back to Dashboard
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {dailyPlan.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / dailyPlan.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentStepData.icon}</span>
            <div>
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              <CardDescription>Duration: {currentStepData.duration}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Array.isArray(currentStepData.content) ? (
            <div className="space-y-3">
              {currentStepData.content.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 font-semibold">{index + 1}.</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            currentStepData.content
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
        >
          ← Previous
        </Button>
        
        <div className="flex gap-2">
          {dailyPlan.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-purple-600' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === dailyPlan.length - 1}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {currentStep === dailyPlan.length - 1 ? 'Complete! 🎉' : 'Next →'}
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium">
            "Learn little by little, and one day you'll know everything!"
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Small steps every day lead to big success!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}