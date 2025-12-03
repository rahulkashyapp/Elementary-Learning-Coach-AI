'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StudentOnboarding } from '@/components/StudentOnboarding'
import { DiagnosticTest } from '@/components/DiagnosticTest'
import { LearningDashboard } from '@/components/LearningDashboard'
import { DailyPlan } from '@/components/DailyPlan'
import { WeeklyPlan } from '@/components/WeeklyPlan'
import { MiliChatbot } from '@/components/MiliChatbot'
import { ParentReport } from '@/components/ParentReport'

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

export default function Home() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'diagnostic' | 'dashboard' | 'daily' | 'weekly' | 'report' | 'chatbot'>('onboarding')
  const [studentData, setStudentData] = useState<StudentData | null>(null)

  const [assessmentAttempt, setAssessmentAttempt] = useState(1)

  const handleStudentComplete = (data: StudentData) => {
    setStudentData(data)
    setCurrentView('diagnostic')
  }

  const handleDiagnosticComplete = (updatedData: StudentData) => {
    setStudentData(updatedData)
    setCurrentView('dashboard')
    setAssessmentAttempt(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            🎓 Elementary Learning Coach AI
          </h1>
          <p className="text-gray-600">
            Personalized learning for Grades 1-5 | CBSE/NCERT Curriculum
          </p>
        </header>

        {currentView === 'onboarding' && (
          <StudentOnboarding onComplete={handleStudentComplete} />
        )}

        {currentView === 'diagnostic' && studentData && (
          <DiagnosticTest 
            studentData={studentData} 
            assessmentAttempt={assessmentAttempt}
            onComplete={handleDiagnosticComplete} 
          />
        )}

        {currentView === 'dashboard' && studentData && (
          <LearningDashboard 
            studentData={studentData}
            onViewChange={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'daily' && studentData && (
          <DailyPlan 
            studentData={studentData}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'weekly' && studentData && (
          <WeeklyPlan 
            studentData={studentData}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'report' && studentData && (
          <ParentReport 
            studentData={studentData} 
            assessmentAttempt={assessmentAttempt}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'chatbot' && (
          <MiliChatbot onBack={() => setCurrentView('dashboard')} />
        )}
      </div>
    </div>
  )
}