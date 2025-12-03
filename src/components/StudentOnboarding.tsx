'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StudentData {
  name: string
  grade: number
  studyTimePerDay: number
  masteryScores: {
    math: {
      place_value: number
      addition: number
      subtraction: number
      multiplication: number
      division: number
      fractions: number
      decimals: number
      geometry: number
      measurement: number
    }
    english: {
      phonics: number
      sight_words: number
      grammar: number
      reading: number
      comprehension: number
    }
  }
}

interface StudentOnboardingProps {
  onComplete: (data: StudentData) => void
}

export function StudentOnboarding({ onComplete }: StudentOnboardingProps) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<number | null>(null)
  const [studyTime, setStudyTime] = useState<number | null>(null)

  const initializeMasteryScores = () => ({
    math: {
      place_value: 0.5,
      addition: 0.5,
      subtraction: 0.5,
      multiplication: 0.5,
      division: 0.5,
      fractions: 0.5,
      decimals: 0.5,
      geometry: 0.5,
      measurement: 0.5
    },
    english: {
      phonics: 0.5,
      sight_words: 0.5,
      grammar: 0.5,
      reading: 0.5,
      comprehension: 0.5
    }
  })

  const handleSubmit = () => {
    if (name && grade && studyTime) {
      const studentData: StudentData = {
        name,
        grade,
        studyTimePerDay: studyTime,
        masteryScores: initializeMasteryScores()
      }
      onComplete(studentData)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-purple-700">
            🌟 Welcome, Student!
          </CardTitle>
          <CardDescription>
            Hi! I'm your learning buddy! Let's start with some fun questions to see what you already know!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium">
              Your Grade
            </Label>
            <Select onValueChange={(value) => setGrade(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
                <SelectItem value="4">Grade 4</SelectItem>
                <SelectItem value="5">Grade 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-time" className="text-sm font-medium">
              Daily Study Time
            </Label>
            <Select onValueChange={(value) => setStudyTime(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="How much time can you study daily?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!name || !grade || !studyTime}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            Start Learning Journey 🚀
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>Don't worry, learning will be fun and easy!</p>
            <p>You're going to do great!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}