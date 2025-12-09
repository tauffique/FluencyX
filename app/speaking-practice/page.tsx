'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mic, Volume2, Trophy, Sparkles, MessageSquare, ChevronRight, Award, TrendingUp } from 'lucide-react'

interface UserStats {
  totalSessions: number
  averageScore: number
  streak: number
  bestScore: number
}

export default function SpeakingPractice() {
  const router = useRouter()
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [userLevel, setUserLevel] = useState('')
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user settings
    const target = localStorage.getItem('targetLanguage') || 'es'
    const native = localStorage.getItem('nativeLanguage') || 'en'
    const level = localStorage.getItem('userLevel') || 'beginner'
    
    setTargetLanguage(target)
    setNativeLanguage(native)
    setUserLevel(level)

    // Load stats from localStorage
    const savedStats = localStorage.getItem('speakingStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    } else {
      // Initialize stats
      const initialStats = {
        totalSessions: 0,
        averageScore: 0,
        streak: 0,
        bestScore: 0
      }
      setUserStats(initialStats)
      localStorage.setItem('speakingStats', JSON.stringify(initialStats))
    }

    setLoading(false)
  }, [])

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
      pt: '🇵🇹', ru: '🇷🇺', ja: '🇯🇵', ko: '🇰🇷', zh: '🇨🇳'
    }
    return flags[code] || '🌍'
  }

  const getLanguageName = (code: string) => {
    const names: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }
    return names[code] || code.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span className="font-medium">Dashboard</span>
              </button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-gray-600 text-sm">
                {getLanguageFlag(nativeLanguage)} → {getLanguageFlag(targetLanguage)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-sora text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Speaking Practice
          </h1>
          <p className="text-xl text-gray-600">
            Practice speaking {getLanguageName(targetLanguage)} with AI evaluation
          </p>
        </div>

        {/* Stats Bar */}
        {userStats && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.totalSessions}</div>
                <div className="text-gray-600 text-sm">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.averageScore}%</div>
                <div className="text-gray-600 text-sm">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.streak} 🔥</div>
                <div className="text-gray-600 text-sm">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.bestScore}%</div>
                <div className="text-gray-600 text-sm">Best Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Practice Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-lg border-2 border-indigo-200 mb-8">
          <div className="text-center mb-6">
            <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="font-sora text-2xl font-bold text-gray-900 mb-2">
              AI-Powered Speaking Evaluation
            </h2>
            <p className="text-gray-700 text-lg">
              Get a scenario, speak your response, and receive detailed AI feedback
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">How it works:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <p className="text-gray-700">AI generates a speaking scenario in {getLanguageName(targetLanguage)}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <p className="text-gray-700">You speak your response (30-60 seconds)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <p className="text-gray-700">AI evaluates: grammar, vocabulary, fluency, pronunciation</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <p className="text-gray-700">Get detailed feedback in {getLanguageName(nativeLanguage)}, then see improvements in {getLanguageName(targetLanguage)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/speaking-practice/session')}
            className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-3"
          >
            <Mic className="w-6 h-6" />
            <span>Start Speaking Practice</span>
          </button>
        </div>

        {/* Scenario Categories */}
        <div className="mb-8">
          <h2 className="font-sora text-2xl font-bold text-gray-900 mb-6">Practice Scenarios</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: '🏨', name: 'Travel', category: 'travel' },
              { emoji: '🍽️', name: 'Restaurant', category: 'restaurant' },
              { emoji: '🛒', name: 'Shopping', category: 'shopping' },
              { emoji: '💼', name: 'Business', category: 'business' },
              { emoji: '🏥', name: 'Health', category: 'health' },
              { emoji: '🎓', name: 'Education', category: 'education' },
              { emoji: '💬', name: 'Social', category: 'social' },
              { emoji: '📞', name: 'Phone Call', category: 'phone' }
            ].map((cat) => (
              <button
                key={cat.category}
                onClick={() => router.push(`/speaking-practice/session?category=${cat.category}`)}
                className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <div className="text-gray-900 font-semibold text-sm">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  )
}