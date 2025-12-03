'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  text: string
  sender: 'user' | 'mili'
  timestamp: Date
}

interface ChatSession {
  currentTopic: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: 'math' | 'english' | 'general'
  questionCount: number
}

interface MiliChatbotProps {
  onBack?: () => void
}

export function MiliChatbot({ onBack }: MiliChatbotProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Mili! 🌟\nI'm your learning buddy! Let's start with some fun questions to see what you already know!\nWhat do you want to learn today? 😊",
      sender: 'mili',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession>({
    currentTopic: '',
    difficulty: 'easy',
    subject: 'general',
    questionCount: 0
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateMiliResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Greetings
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hi beta! 😊\nReady to learn something fun today?\nTell me what you want to study! 📚"
    }
    
    // Math topics
    if (lowerMessage.includes('math') || lowerMessage.includes('addition') || lowerMessage.includes('plus')) {
      setChatSession(prev => ({ ...prev, subject: 'math', currentTopic: 'addition' }))
      return "Math is so much fun! 🔢\nLet's start with easy addition!\nWhat is 2 + 3? 🍎 + 🍎 = ?"
    }
    
    if (lowerMessage.includes('subtraction') || lowerMessage.includes('minus')) {
      setChatSession(prev => ({ ...prev, subject: 'math', currentTopic: 'subtraction' }))
      return "Subtraction is like taking away! ➖\nIf you have 5 apples and eat 2, how many left?\n5 - 2 = ? 🍎"
    }
    
    if (lowerMessage.includes('multiplication') || lowerMessage.includes('times')) {
      setChatSession(prev => ({ ...prev, subject: 'math', currentTopic: 'multiplication' }))
      return "Multiplication is repeated addition! ✖️\n2 × 3 means 2 + 2 + 2\nLet's try: 3 × 2 = ?"
    }
    
    // English topics
    if (lowerMessage.includes('english') || lowerMessage.includes('words') || lowerMessage.includes('vocabulary')) {
      setChatSession(prev => ({ ...prev, subject: 'english', currentTopic: 'words' }))
      return "English words are amazing! 📖\nLet's learn some new words!\nWhat starts with 'A' like Apple? 🍎"
    }
    
    if (lowerMessage.includes('phonics') || lowerMessage.includes('sounds')) {
      setChatSession(prev => ({ ...prev, subject: 'english', currentTopic: 'phonics' }))
      return "Phonics help us read! 🔊\n'C' says 'cuh' like in Cat!\nCan you say 'cuh-cuh-cat'? 😊"
    }
    
    // Help and understanding
    if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
      return "No problem beta! I'm here to help! 🧠💡\nTake your time, I'll explain slowly!\nWhat part is tricky? 🤔"
    }
    
    if (lowerMessage.includes('don\'t understand') || lowerMessage.includes('confused')) {
      return "Koi baat nahi! Let me explain easier! 😊\nLearning takes time, that's okay!\nWant me to use examples? 🌟"
    }
    
    // Difficulty requests
    if (lowerMessage.includes('easy')) {
      setChatSession(prev => ({ ...prev, difficulty: 'easy' }))
      return "Easy peasy! 😊\nWe'll start with simple questions!\nYou'll do great! ⭐"
    }
    
    if (lowerMessage.includes('hard') || lowerMessage.includes('difficult')) {
      setChatSession(prev => ({ ...prev, difficulty: 'hard' }))
      return "Challenge accepted! 💪\nYou're smart enough for hard questions!\nLet's try something tricky! 🧠"
    }
    
    // Navigation
    if (lowerMessage.includes('next') || lowerMessage.includes('continue')) {
      return generateNextQuestion()
    }
    
    if (lowerMessage.includes('stop') || lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Bye bye beta! 👋\nGreat learning today!\nCome back tomorrow for more fun! 🌈"
    }
    
    // Explain specific topics
    if (lowerMessage.includes('explain addition')) {
      return "Addition is like putting things together! ➕\nIf you have 2 cookies and get 3 more, you have 5!\n2 + 3 = 5 🍪"
    }
    
    if (lowerMessage.includes('explain subtraction')) {
      return "Subtraction is taking away! ➖\nIf you have 5 balloons and 2 fly away, 3 left!\n5 - 2 = 3 🎈"
    }
    
    if (lowerMessage.includes('explain multiplication')) {
      return "Multiplication is fast adding! ✖️\n3 × 2 means 3 groups of 2, or 2 + 2 + 2!\nEasy way to count fast! 🧮"
    }
    
    if (lowerMessage.includes('explain phonics')) {
      return "Phonics helps us read sounds! 🔊\nEach letter makes a special sound!\n'A' says 'a' like in apple! 🍎"
    }
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      return "Great question! Let me explain! 🧐\nI'll use simple examples just for you!\nWhat topic do you want to know about? 📚"
    }
    
    // Answer checking for math
    if (chatSession.subject === 'math') {
      return checkMathAnswer(userMessage)
    }
    
    // Answer checking for english
    if (chatSession.subject === 'english') {
      return checkEnglishAnswer(userMessage)
    }
    
    // Default response
    return "That's interesting! 🤔\nCan you tell me more?\nI'm here to help you learn! 😊"
  }

  const generateNextQuestion = (): string => {
    const { subject, difficulty, questionCount } = chatSession
    
    if (subject === 'math') {
      if (difficulty === 'easy') {
        const questions = [
          "What comes after 7? 🔢\nThink about counting!\n7, 8, ?",
          "How many fingers on one hand? 🖐️\nCount them!\n1, 2, 3, 4, 5!",
          "2 + 1 = ? ➕\nEasy addition!\nStart with 2 and add 1 more!"
        ]
        return questions[questionCount % questions.length]
      } else {
        const questions = [
          "What is 15 + 8? 🔢\nTry counting on!\n15 + 5 = 20, then + 3 more!",
          "7 × 6 = ? ✖️\nThink: 7 × 5 = 35, plus one more 7!",
          "24 - 9 = ? ➖\nCount back from 24!\n24, 23, 22... 🤔"
        ]
        return questions[questionCount % questions.length]
      }
    }
    
    if (subject === 'english') {
      if (difficulty === 'easy') {
        const questions = [
          "What rhymes with 'cat'? 🐱\nThink: hat, bat, ?\nSomething you wear on feet!",
          "Which word starts with 'B'? 🐝\nBall, Book, or Cat?\nThink of the 'buh' sound!",
          "How many letters in 'dog'? 🐕\nD-O-G\nCount them! 1, 2, ?"
        ]
        return questions[questionCount % questions.length]
      } else {
        const questions = [
          "Make a sentence with 'happy'! 😊\nUse your imagination!\n'I feel happy when...'",
          "What's the opposite of 'big'? 🐘\nThink small!\nLike mouse is ? than elephant!",
          "Spell 'beautiful' 🌺\nB-E-A-U-?-\?-F-U-L\nTry your best!"
        ]
        return questions[questionCount % questions.length]
      }
    }
    
    return "What would you like to learn? 📚\nMath or English?\nTell me! 😊"
  }

  const checkMathAnswer = (answer: string): string => {
    const numAnswer = parseInt(answer)
    
    if (isNaN(numAnswer)) {
      return "Is that a number? 🔢\nTry using digits like 5, 10, 15!\nYou can do it! 💪"
    }
    
    // Simple positive encouragement for any number
    const encouragements = [
      "Great try! ⭐\nMath is all about practice!\nWant to try another? 🤔",
      "Good thinking! 🧠\nYou're working so hard!\nLet's try the next one! 😊",
      "Wah! Nice work! 👏\nEvery answer helps you learn!\nReady for more? 📚"
    ]
    
    return encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  const checkEnglishAnswer = (answer: string): string => {
    const encouragements = [
      "Beautiful! ✨\nYour English is getting better!\nWant to learn more words? 📖",
      "Super! 🌟\nYou're speaking so well!\nLet's try another word! 😊",
      "Amazing! 🎉\nEnglish is fun with you!\nWhat else should we learn? 🤔"
    ]
    
    return encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate Mili thinking
    setTimeout(() => {
      const miliResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMiliResponse(inputText),
        sender: 'mili',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, miliResponse])
      setIsTyping(false)
      setChatSession(prev => ({ ...prev, questionCount: prev.questionCount + 1 }))
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { text: "Math", emoji: "🔢", action: () => setInputText("I want to learn math") },
    { text: "English", emoji: "📚", action: () => setInputText("I want to learn English") },
    { text: "Easy", emoji: "😊", action: () => setInputText("Give me easy questions") },
    { text: "Help", emoji: "🧠", action: () => setInputText("Help me") },
    { text: "Hard", emoji: "💪", action: () => setInputText("Give me hard questions") },
    { text: "Explain", emoji: "🧐", action: () => setInputText("Explain addition") }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🌟</span>
              Mili - Your Friendly Learning Helper
            </CardTitle>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                ← Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">Online</Badge>
            <span className="text-sm">Ready to help you learn! 😊</span>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.sender === 'mili' && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🌟</span>
                      <span className="text-xs font-semibold text-purple-600">Mili</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌟</span>
                    <span className="text-xs font-semibold text-purple-600">Mili</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="flex items-center gap-1 text-xs"
              >
                <span>{action.emoji}</span>
                <span>{action.text}</span>
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... 📝"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Send ✨
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">
              💡 <strong>Tips:</strong> Ask me about Math, English, or say "Help" if you're stuck!
              I can make questions easier or harder for you! 😊
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}