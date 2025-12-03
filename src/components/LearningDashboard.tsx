'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StudentData } from '@/app/page'

interface LearningDashboardProps {
  studentData: StudentData
  onViewChange: (view: 'daily' | 'weekly' | 'report' | 'chatbot') => void
}

export function LearningDashboard({ studentData, onViewChange }: LearningDashboardProps) {
  const getMasteryLevel = (score: number) => {
    if (score >= 0.9) return { level: 'Mastered', color: 'bg-green-500', text: 'text-green-700' }
    if (score >= 0.7) return { level: 'Satisfactory', color: 'bg-blue-500', text: 'text-blue-700' }
    if (score >= 0.4) return { level: 'Needs Improvement', color: 'bg-yellow-500', text: 'text-yellow-700' }
    return { level: 'Critical Weak Area', color: 'bg-red-500', text: 'text-red-700' }
  }

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

  const getStrongSkills = () => {
    const strongSkills: Array<{ subject: string; skill: string; score: number }> = []
    
    Object.entries(studentData.masteryScores.math).forEach(([skill, score]) => {
      if (score >= 0.7) {
        strongSkills.push({ subject: 'Math', skill: skill.replace('_', ' '), score })
      }
    })
    
    Object.entries(studentData.masteryScores.english).forEach(([skill, score]) => {
      if (score >= 0.7) {
        strongSkills.push({ subject: 'English', skill: skill.replace('_', ' '), score })
      }
    })
    
    return strongSkills.sort((a, b) => b.score - a.score)
  }

  const weakSkills = getWeakSkills()
  const strongSkills = getStrongSkills()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">
            👋 Welcome back, {studentData.name}!
          </CardTitle>
          <CardDescription className="text-purple-100">
            Grade {studentData.grade} • {studentData.studyTimePerDay} minutes daily study time
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Button
          onClick={() => onViewChange('daily')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="font-semibold">Today's Plan</div>
            <div className="text-sm opacity-90">15-minute session</div>
          </div>
        </Button>

        <Button
          onClick={() => onViewChange('weekly')}
          variant="outline"
          className="p-6 h-auto border-2"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📆</div>
            <div className="font-semibold">Weekly Plan</div>
            <div className="text-sm text-gray-600">5-day schedule</div>
          </div>
        </Button>

        <Button
          onClick={() => onViewChange('report')}
          variant="outline"
          className="p-6 h-auto border-2"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">Progress</div>
            <div className="text-sm text-gray-600">View report</div>
          </div>
        </Button>

        <Button
          onClick={() => onViewChange('chatbot')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 h-auto"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🌟</div>
            <div className="font-semibold">Chat with Mili</div>
            <div className="text-sm opacity-90">Ask questions!</div>
          </div>
        </Button>

        <Button
          onClick={() => onViewChange('diagnostic')}
          className="bg-orange-600 hover:bg-orange-700 text-white p-6 h-auto"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold">Retake Test</div>
            <div className="text-sm opacity-90">Math & English</div>
          </div>
        </Button>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔢 Math Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(studentData.masteryScores.math).map(([skill, score]) => {
              const level = getMasteryLevel(score)
              return (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {skill.replace('_', ' ')}
                    </span>
                    <Badge className={level.text} variant="outline">
                      {level.level}
                    </Badge>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                  <div className="text-xs text-gray-600 text-right">
                    {Math.round(score * 100)}%
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* English Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 English Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(studentData.masteryScores.english).map(([skill, score]) => {
              const level = getMasteryLevel(score)
              return (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {skill.replace('_', ' ')}
                    </span>
                    <Badge className={level.text} variant="outline">
                      {level.level}
                    </Badge>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                  <div className="text-xs text-gray-600 text-right">
                    {Math.round(score * 100)}%
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Improvement */}
        {weakSkills.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                🎯 Focus Areas
              </CardTitle>
              <CardDescription>
                These skills need more practice! Let's work on them together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weakSkills.slice(0, 3).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{skill.subject}</div>
                      <div className="text-xs text-gray-600 capitalize">{skill.skill}</div>
                    </div>
                    <div className="text-sm font-semibold text-red-700">
                      {Math.round(skill.score * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strong Areas */}
        {strongSkills.length > 0 && (
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                ⭐ Strong Areas
              </CardTitle>
              <CardDescription>
                Amazing work! You're doing great in these skills! 🌟
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strongSkills.slice(0, 3).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{skill.subject}</div>
                      <div className="text-xs text-gray-600 capitalize">{skill.skill}</div>
                    </div>
                    <div className="text-sm font-semibold text-green-700">
                      {Math.round(skill.score * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-2">💪</div>
          <h3 className="font-semibold text-lg mb-2">Keep going, champion!</h3>
          <p className="text-gray-700">
            Every day you learn something new, you become stronger and smarter! 
            Keep up the great work!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}