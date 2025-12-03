'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StudentData } from '@/app/page'

interface WeeklyPlanProps {
  studentData: StudentData
  onBack: () => void
}

export function WeeklyPlan({ studentData, onBack }: WeeklyPlanProps) {
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

  const generateDailyPlan = (day: number, focusSkill?: { subject: string; skill: string }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const dayName = days[day]
    
    if (!focusSkill) {
      return {
        day: dayName,
        theme: 'Mixed Practice',
        activities: [
          'Review previous concepts',
          'Practice both Math and English',
          'Fun educational games'
        ]
      }
    }

    if (focusSkill.subject === 'Math') {
      return {
        day: dayName,
        theme: `Math Focus: ${focusSkill.skill}`,
        activities: [
          `Warm-up: Counting practice (2 min)`,
          `Main: ${focusSkill.skill} exercises (8 min)`,
          `Game: Math puzzle or activity (5 min)`
        ]
      }
    } else {
      return {
        day: dayName,
        theme: `English Focus: ${focusSkill.skill}`,
        activities: [
          `Warm-up: Alphabet practice (2 min)`,
          `Main: ${focusSkill.skill} practice (8 min)`,
          `Game: Word games or storytelling (5 min)`
        ]
      }
    }
  }

  const weeklyPlan = [
    generateDailyPlan(0, weakSkills[0]),
    generateDailyPlan(1, weakSkills[1]),
    generateDailyPlan(2, weakSkills[2] || weakSkills[0]),
    generateDailyPlan(3, weakSkills[3] || weakSkills[1]),
    generateDailyPlan(4, weakSkills[4] || weakSkills[0])
  ]

  const weeklyTest = {
    title: 'Weekly Mini-Test',
    description: 'Quick assessment of this week\'s learning',
    duration: '10 minutes',
    skills: weakSkills.slice(0, 3).map(s => `${s.subject}: ${s.skill}`),
    tips: [
      'Don\'t worry about scores',
      'Just try your best',
      'Review mistakes together'
    ]
  }

  const weekendActivity = {
    title: 'Weekend Fun Activity',
    description: 'Learning through play and real-life practice',
    options: [
      {
        name: 'Kitchen Math',
        description: 'Help measure ingredients while cooking',
        skills: ['Measurement', 'Counting', 'Fractions']
      },
      {
        name: 'Story Time',
        description: 'Read a story together and discuss it',
        skills: ['Reading', 'Comprehension', 'Vocabulary']
      },
      {
        name: 'Shopping Game',
        description: 'Practice counting money and making change',
        skills: ['Addition', 'Subtraction', 'Money concepts']
      }
    ]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-700">
                📆 Weekly Learning Plan
              </CardTitle>
              <CardDescription>
                Personalized for {studentData.name} • Grade {studentData.grade} • {studentData.studyTimePerDay} minutes daily
              </CardDescription>
            </div>
            <Button onClick={onBack} variant="outline">
              ← Back to Dashboard
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Focus Skills Overview */}
      {weakSkills.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              🎯 This Week's Focus Areas
            </CardTitle>
            <CardDescription>
              We'll work extra hard on these skills this week!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weakSkills.slice(0, 3).map((skill, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {skill.subject}
                    </Badge>
                    <span className="text-xs font-semibold text-orange-700">
                      {Math.round(skill.score * 100)}%
                    </span>
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {skill.skill}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {weeklyPlan.map((day, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">
                  {['🌅', '🌤️', '☀️', '🌤️', '🌅'][index]}
                </span>
                {day.day}
              </CardTitle>
              <CardDescription className="text-sm">
                {day.theme}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-start gap-2">
                    <span className="text-purple-600 text-xs mt-1">•</span>
                    <span className="text-sm">{activity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    📚 {studentData.studyTimePerDay} minutes
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Day {index + 1}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Test */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 {weeklyTest.title}
          </CardTitle>
          <CardDescription>
            {weeklyTest.description} • {weeklyTest.duration}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Skills Covered:</h4>
              <div className="space-y-1">
                {weeklyTest.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips for Success:</h4>
              <div className="space-y-1">
                {weeklyTest.tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekend Activities */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎉 {weekendActivity.title}
          </CardTitle>
          <CardDescription>
            {weekendActivity.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weekendActivity.options.map((option, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">
                  {option.name}
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {option.description}
                </p>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-600">Skills practiced:</div>
                  {option.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="text-xs mr-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parent Tips */}
      <Card className="bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            👨‍👩‍👧‍👦 Parent Tips for the Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Daily Routine:</h4>
              <ul className="text-sm space-y-1">
                <li>• Fix a regular study time</li>
                <li>• Create a quiet study space</li>
                <li>• Keep water and snacks nearby</li>
                <li>• Celebrate small wins daily</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Motivation Tips:</h4>
              <ul className="text-sm space-y-1">
                <li>• Praise effort, not just results</li>
                <li>• Use stickers or stars for progress</li>
                <li>• Connect learning to daily life</li>
                <li>• Be patient and encouraging</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm text-center font-medium text-yellow-800">
              "Children learn better with patience and encouragement!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}