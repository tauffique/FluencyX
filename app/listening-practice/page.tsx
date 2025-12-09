'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Headphones, Play, Trophy, TrendingUp, ChevronRight, Zap, Volume2 } from 'lucide-react'

interface Story {
  id: string
  title: string
  difficulty: string
  duration: string
  category: string
  completed: boolean
  score?: number
}

export default function ListeningPractice() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [userLevel, setUserLevel] = useState('')
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    totalListeningTime: '0h'
  })

  useEffect(() => {
    // Get user settings
    const target = localStorage.getItem('targetLanguage') || 'es'
    const native = localStorage.getItem('nativeLanguage') || 'en'
    const level = localStorage.getItem('userLevel') || 'beginner'
    
    setTargetLanguage(target)
    setNativeLanguage(native)
    setUserLevel(level)

    // Load saved stories
    loadStories()
    loadStats()
    
    setLoading(false)
  }, [])

  const loadStories = () => {
    const savedStories = localStorage.getItem('listeningStories')
    if (savedStories) {
      setStories(JSON.parse(savedStories))
    }
  }

  const loadStats = () => {
    const savedStats = localStorage.getItem('listeningStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }

  const generateNewStories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-listening-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage,
          nativeLanguage,
          userLevel,
          count: 5
        })
      })

      const data = await response.json()
      const newStories = data.stories.map((story: any, index: number) => ({
        id: `story-${Date.now()}-${index}`,
        ...story,
        completed: false
      }))

      setStories(newStories)
      localStorage.setItem('listeningStories', JSON.stringify(newStories))
    } catch (error) {
      console.error('Error generating stories:', error)
    }
    setLoading(false)
  }

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
      pt: '🇵🇹', ru: '🇷🇺', ja: '🇯🇵', ko: '🇰🇷', zh: '🇨🇳'
    }
    return flags[code] || '🌍'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'bg-green-100 text-green-700 border-green-300',
      intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      advanced: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[difficulty] || colors.beginner
  }

  const getDifficultyStars = (difficulty: string) => {
    const stars: { [key: string]: string } = {
      beginner: '⭐',
      intermediate: '⭐⭐⭐',
      advanced: '⭐⭐⭐⭐⭐'
    }
    return stars[difficulty] || '⭐'
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
                {getLanguageFlag(targetLanguage)} Learning
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Headphones className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-sora text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Listening Comprehension
          </h1>
          <p className="text-xl text-gray-600">
            Listen to AI-generated stories and answer questions
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ✨ Like IELTS/DAF tests: Listen up to 2 times only
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCompleted}</div>
              <div className="text-gray-600 text-sm">Stories Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.averageScore}%</div>
              <div className="text-gray-600 text-sm">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.currentStreak} 🔥</div>
              <div className="text-gray-600 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalListeningTime}</div>
              <div className="text-gray-600 text-sm">Listening Time</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-lg border-2 border-blue-200 mb-8">
          <h2 className="font-sora text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Volume2 className="w-7 h-7 text-blue-600 mr-3" />
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="text-3xl mb-2">🎧</div>
              <div className="font-semibold text-gray-900 mb-1">1. Listen</div>
              <div className="text-sm text-gray-600">Listen to the story carefully (max 2 times)</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-3xl mb-2">❓</div>
              <div className="font-semibold text-gray-900 mb-1">2. Answer</div>
              <div className="text-sm text-gray-600">Answer 5-6 comprehension questions</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-gray-900 mb-1">3. Get Results</div>
              <div className="text-sm text-gray-600">AI evaluates instantly and shows feedback</div>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sora text-2xl font-bold text-gray-900">Available Stories</h2>
            <button
              onClick={generateNewStories}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Generate New Stories</span>
            </button>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-20">
              <Headphones className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stories Yet</h3>
              <p className="text-gray-600 mb-6">Click "Generate New Stories" to get started!</p>
              <button
                onClick={generateNewStories}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Generate Stories Now
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => router.push(`/listening-practice/${story.id}`)}
                >
                  {/* Story Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-sora text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(story.difficulty)}`}>
                      {story.difficulty}
                    </span>
                    <span className="text-gray-600 text-sm">{getDifficultyStars(story.difficulty)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Volume2 className="w-4 h-4 mr-1" />
                      <span>{story.duration}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {story.category}
                    </div>
                  </div>

                  {/* Status */}
                  {story.completed ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-semibold text-sm">Completed</span>
                      </div>
                      <span className="text-green-700 font-bold">{story.score}%</span>
                    </div>
                  ) : (
                    <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Start Listening</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <h2 className="font-sora text-2xl font-bold text-gray-900 mb-6">Listening Tips 💡</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">First Listen: Overview</h4>
                <p className="text-sm text-gray-600">Get the general idea and main points</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Second Listen: Details</h4>
                <p className="text-sm text-gray-600">Focus on specific information and keywords</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Take Notes</h4>
                <p className="text-sm text-gray-600">Write down key information while listening</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Don't Panic</h4>
                <p className="text-sm text-gray-600">If you miss something, stay calm and focus ahead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}