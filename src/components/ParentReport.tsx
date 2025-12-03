'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { StudentData } from '@/app/page'

interface ParentReportProps {
  studentData: StudentData
  onBack: () => void
  assessmentAttempt?: number
}

export function ParentReport({ studentData, onBack, assessmentAttempt = 1 }: ParentReportProps) {
  const getMasteryLevel = (score: number) => {
    if (score >= 0.9) return { level: 'Mastered', color: 'bg-green-500', text: 'text-green-700', emoji: '🌟' }
    if (score >= 0.7) return { level: 'Satisfactory', color: 'bg-blue-500', text: 'text-blue-700', emoji: '✅' }
    if (score >= 0.4) return { level: 'Needs Improvement', color: 'bg-yellow-500', text: 'text-yellow-700', emoji: '📈' }
    return { level: 'Critical Weak Area', color: 'bg-red-500', text: 'text-red-700', emoji: '⚠️' }
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

  const getOverallPerformance = () => {
    const allScores = [
      ...Object.values(studentData.masteryScores.math),
      ...Object.values(studentData.masteryScores.english)
    ]
    const average = allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    return getMasteryLevel(average)
  }

  const getRecommendations = () => {
    const weakSkills = getWeakSkills()
    const recommendations: string[] = []

    if (weakSkills.length > 0) {
      recommendations.push(`Focus on ${weakSkills[0].skill} - practice 10 minutes daily`)
      recommendations.push('Use real-life examples to explain concepts')
      recommendations.push('Celebrate small improvements and effort')
    }

    if (studentData.studyTimePerDay < 30) {
      recommendations.push('Consider increasing daily study time to 30 minutes')
    }

    recommendations.push('Maintain consistent daily routine')
    recommendations.push('Review progress weekly with child')

    return recommendations
  }

  const strongSkills = getStrongSkills()
  const weakSkills = getWeakSkills()
  const overallPerformance = getOverallPerformance()
  const recommendations = getRecommendations()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-700">
                📊 Student Progress Report
              </CardTitle>
              <CardDescription>
                For Parents and Teachers • Generated on {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-100 text-blue-800">
                Assessment #{assessmentAttempt}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Student Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Student Name</div>
              <div className="font-semibold">{studentData.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Grade Level</div>
              <div className="font-semibold">Grade {studentData.grade}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Daily Study Time</div>
              <div className="font-semibold">{studentData.studyTimePerDay} minutes</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Overall Performance</div>
              <div className="font-semibold flex items-center gap-2">
                <span>{overallPerformance.emoji}</span>
                <span className={overallPerformance.text}>
                  {overallPerformance.level}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Skills */}
        {strongSkills.length > 0 && (
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                🌟 Strong Skills
              </CardTitle>
              <CardDescription>
                Areas where the student is performing well
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strongSkills.map((skill, index) => {
                  const level = getMasteryLevel(skill.score)
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{skill.subject}</div>
                        <div className="text-xs text-gray-600 capitalize">{skill.skill}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-700">
                          {Math.round(skill.score * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">{level.level}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weak Skills */}
        {weakSkills.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                📈 Areas Needing Attention
              </CardTitle>
              <CardDescription>
                Skills that require additional practice and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weakSkills.map((skill, index) => {
                  const level = getMasteryLevel(skill.score)
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{skill.subject}</div>
                        <div className="text-xs text-gray-600 capitalize">{skill.skill}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-red-700">
                          {Math.round(skill.score * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">{level.level}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subject-wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔢 Mathematics Performance
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{Math.round(score * 100)}%</span>
                      <span className="text-lg">{level.emoji}</span>
                    </div>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* English Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 English Performance
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{Math.round(score * 100)}%</span>
                      <span className="text-lg">{level.emoji}</span>
                    </div>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            💡 Recommendations & Interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Suggested Interventions:</h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 text-sm mt-1">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Next Week Goals:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 text-sm mt-1">✓</span>
                  <span className="text-sm">Improve weak skills by 15-20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 text-sm mt-1">✓</span>
                  <span className="text-sm">Maintain strong skills above 80%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 text-sm mt-1">✓</span>
                  <span className="text-sm">Complete daily learning plan consistently</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 text-sm mt-1">✓</span>
                  <span className="text-sm">Score above 70% in weekly test</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Notes */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            📝 Notes for Parents/Guardians
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">Notes for Parents:</h4>
              <p className="text-gray-700">
                Your child is showing good progress. Please focus on the weak areas and ensure daily practice. 
                Be patient and encourage your child's efforts. Remember, every child learns at their own pace.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              This report is generated based on adaptive assessment results. 
              For detailed questions, please consult with the teacher.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => window.print()} className="bg-purple-600 hover:bg-purple-700">
          🖨️ Print Report
        </Button>
        <Button onClick={onBack} variant="outline">
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  )
}