'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Zap, Target, BarChart3, Sparkles, Loader2, RotateCcw } from 'lucide-react'

export default function FlashcardsPage() {
  const router = useRouter()
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [stats, setStats] = useState({
    wordsLearned: 0,
    sentencesLearned: 0,
    paragraphsLearned: 0,
    totalCards: 0,
    accuracy: 0
  })

  useEffect(() => {
    // Get languages
    const target = localStorage.getItem('targetLanguage')
    const native = localStorage.getItem('nativeLanguage') || 'en'
    
    if (target) setTargetLanguage(target)
    setNativeLanguage(native)

    // Load stats
    loadStats()

    // Check if languages changed - reset if needed
    const savedFlashcardLang = localStorage.getItem('flashcardLanguage')
    if (savedFlashcardLang && savedFlashcardLang !== target) {
      // Languages changed - reset everything
      resetFlashcards()
      localStorage.setItem('flashcardLanguage', target || '')
    } else if (!savedFlashcardLang) {
      localStorage.setItem('flashcardLanguage', target || '')
    }
  }, [])

  const loadStats = () => {
    const savedStats = localStorage.getItem('flashcardStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }

  const resetFlashcards = () => {
    localStorage.removeItem('flashcardStats')
    localStorage.removeItem('wordFlashcards')
    localStorage.removeItem('sentenceFlashcards')
    localStorage.removeItem('paragraphFlashcards')
    setStats({
      wordsLearned: 0,
      sentencesLearned: 0,
      paragraphsLearned: 0,
      totalCards: 0,
      accuracy: 0
    })
  }

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian'
    }
    return names[code] || code.toUpperCase()
  }

  const startPractice = (mode: 'words' | 'sentences' | 'paragraphs') => {
    router.push(`/flashcards/study?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
            </Link>
            <div className="text-center">
              <h1 className="font-sora text-lg font-bold text-gray-900">Flashcards</h1>
              <p className="text-xs text-gray-500">
                Learning {getLanguageName(targetLanguage)}
              </p>
            </div>
            <button
              onClick={resetFlashcards}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-sora text-3xl font-bold">AI-Powered Flashcards</h2>
              <p className="text-white/90">Master {getLanguageName(targetLanguage)} with smart repetition</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm mb-1">Words Learned</div>
              <div className="text-3xl font-bold">{stats.wordsLearned}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm mb-1">Sentences</div>
              <div className="text-3xl font-bold">{stats.sentencesLearned}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm mb-1">Paragraphs</div>
              <div className="text-3xl font-bold">{stats.paragraphsLearned}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm mb-1">Accuracy</div>
              <div className="text-3xl font-bold">{stats.accuracy}%</div>
            </div>
          </div>
        </div>

        {/* Practice Modes */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Words Mode */}
          <button
            onClick={() => startPractice('words')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-200 text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Word Practice</h3>
            <p className="text-gray-600 mb-4">
              Learn individual words with meanings and examples
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 font-semibold">Start Learning →</span>
              <span className="text-2xl">📚</span>
            </div>
          </button>

          {/* Sentences Mode */}
          <button
            onClick={() => startPractice('sentences')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-purple-200 text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Sentence Practice</h3>
            <p className="text-gray-600 mb-4">
              Master complete sentences with translations
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600 font-semibold">Start Learning →</span>
              <span className="text-2xl">💬</span>
            </div>
          </button>

          {/* Paragraphs Mode */}
          <button
            onClick={() => startPractice('paragraphs')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-indigo-200 text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Paragraph Practice</h3>
            <p className="text-gray-600 mb-4">
              Advanced practice with full paragraphs
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-600 font-semibold">Start Learning →</span>
              <span className="text-2xl">📝</span>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">How AI Flashcards Work</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• <strong>Smart Generation</strong>: AI creates unique flashcards in your target language</li>
                <li>• <strong>Native Translations</strong>: Meanings and examples in your native language</li>
                <li>• <strong>No Repetition</strong>: Each card is unique and generated fresh</li>
                <li>• <strong>Real-time Progress</strong>: Stats update as you learn</li>
                <li>• <strong>Adaptive Learning</strong>: Difficulty adjusts to your level</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}