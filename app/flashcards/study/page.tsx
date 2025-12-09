'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, SkipForward, Check, X, Sparkles, Loader2, Volume2, RotateCcw, Zap, Target } from 'lucide-react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

interface Flashcard {
  id: string
  word: string
  meaning: string
  example?: string
  exampleTranslation?: string
  difficulty: string
}

function StudyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'words'
  
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    total: 0
  })
  const [practiceMode, setPracticeMode] = useState<'normal' | 'mixed' | 'speed'>('normal')
  const [speedTimer, setSpeedTimer] = useState(10)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const target = localStorage.getItem('targetLanguage')
    const native = localStorage.getItem('nativeLanguage') || 'en'
    
    if (target) setTargetLanguage(target)
    setNativeLanguage(native)

    generateFlashcards(mode, target || '', native)
  }, [mode])

  useEffect(() => {
    if (practiceMode === 'speed' && !isFlipped) {
      timerRef.current = setInterval(() => {
        setSpeedTimer(prev => {
          if (prev <= 1) {
            handleAnswer('skip')
            return 10
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setSpeedTimer(10)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [practiceMode, isFlipped, currentIndex])

  const generateFlashcards = async (cardMode: string, target: string, native: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: cardMode,
          targetLanguage: target,
          nativeLanguage: native,
          count: 10,
          mixedMode: practiceMode === 'mixed',
          includeExamples: cardMode === 'words' // Only include examples for words
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setCards(data.flashcards)
      setStats({ correct: 0, incorrect: 0, skipped: 0, total: data.flashcards.length })
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('Failed to generate flashcards. Please check your API configuration.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (result: 'correct' | 'incorrect' | 'skip') => {
    setStats(prev => ({
      ...prev,
      [result === 'skip' ? 'skipped' : result]: prev[result === 'skip' ? 'skipped' : result] + 1
    }))

    // Update global stats
    updateGlobalStats(result)

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setSpeedTimer(10)
    } else {
      // Finished all cards
      showResults()
    }
  }

  const handleSkip = () => {
    handleAnswer('skip')
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setSpeedTimer(10)
    }
  }

  const updateGlobalStats = (result: 'correct' | 'incorrect' | 'skip') => {
    const savedStats = localStorage.getItem('flashcardStats')
    const globalStats = savedStats ? JSON.parse(savedStats) : {
      wordsLearned: 0,
      sentencesLearned: 0,
      paragraphsLearned: 0,
      totalCards: 0,
      accuracy: 0,
      totalCorrect: 0,
      totalAttempted: 0
    }

    if (result === 'correct') {
      globalStats.totalCorrect++
      globalStats.totalAttempted++
      if (mode === 'words') globalStats.wordsLearned++
      if (mode === 'sentences') globalStats.sentencesLearned++
      if (mode === 'paragraphs') globalStats.paragraphsLearned++
    } else if (result === 'incorrect') {
      globalStats.totalAttempted++
    }

    globalStats.totalCards++
    globalStats.accuracy = globalStats.totalAttempted > 0 
      ? Math.round((globalStats.totalCorrect / globalStats.totalAttempted) * 100)
      : 0

    localStorage.setItem('flashcardStats', JSON.stringify(globalStats))
  }

  const showResults = () => {
    const accuracy = stats.total > 0 
      ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
      : 0
    
    alert(`Session Complete!\n\nCorrect: ${stats.correct}\nIncorrect: ${stats.incorrect}\nSkipped: ${stats.skipped}\nAccuracy: ${accuracy}%`)
    router.push('/flashcards')
  }

  const handleSpeak = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: targetLanguage
        })
      })

      if (!response.ok) {
        throw new Error('TTS failed')
      }

      const data = await response.json()
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
      audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = targetLanguage
      window.speechSynthesis.speak(utterance)
    }
  }

  const switchMode = async (newMode: 'normal' | 'mixed' | 'speed') => {
    setPracticeMode(newMode)
    if (newMode === 'mixed' || newMode === 'speed') {
      // Regenerate cards for special modes
      await generateFlashcards(mode, targetLanguage, nativeLanguage)
      setCurrentIndex(0)
      setIsFlipped(false)
      setStats({ correct: 0, incorrect: 0, skipped: 0, total: cards.length })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">Generating AI Flashcards...</p>
          <p className="text-gray-500 text-sm">Creating unique content just for you</p>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cards Generated</h2>
          <p className="text-gray-600 mb-6">Failed to generate flashcards. Please try again.</p>
          <Link href="/flashcards">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Back to Flashcards
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100
  const accuracy = (stats.correct + stats.incorrect) > 0 
    ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/flashcards">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            <div className="text-center">
              <h1 className="font-sora text-lg font-bold text-gray-900 capitalize">{mode} Practice</h1>
              <p className="text-xs text-gray-500">Card {currentIndex + 1} of {cards.length}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-600">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        <div className="flex justify-center space-x-3 mb-6">
          <button
            onClick={() => switchMode('normal')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              practiceMode === 'normal'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => switchMode('mixed')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
              practiceMode === 'mixed'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Mixed</span>
          </button>
          <button
            onClick={() => switchMode('speed')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
              practiceMode === 'speed'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Speed</span>
          </button>
        </div>

        {/* Speed Timer */}
        {practiceMode === 'speed' && !isFlipped && (
          <div className="text-center mb-4">
            <div className={`inline-block px-6 py-3 rounded-full font-bold text-2xl ${
              speedTimer <= 3 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
            }`}>
              {speedTimer}s
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
            <Check className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="font-bold text-green-900">{stats.correct}</div>
            <div className="text-xs text-green-600">Correct</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
            <X className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <div className="font-bold text-red-900">{stats.incorrect}</div>
            <div className="text-xs text-red-600">Incorrect</div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 text-center">
            <SkipForward className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="font-bold text-gray-900">{stats.skipped}</div>
            <div className="text-xs text-gray-600">Skipped</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-6">
          <div
            onClick={handleFlip}
            className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {mode.slice(0, -1).toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSpeak(currentCard.word)
                    }}
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 break-words">
                      {currentCard.word}
                    </div>
                    <p className="text-gray-500 text-sm">Tap to see meaning</p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-400 mt-4">
                  In {targetLanguage.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 shadow-2xl h-full flex flex-col text-white overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    MEANING
                  </span>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="text-2xl md:text-3xl font-bold mb-2 break-words">
                      {currentCard.meaning}
                    </div>
                  </div>
                  
                  {/* Example - Only show for words mode */}
                  {mode === 'words' && currentCard.example && currentCard.exampleTranslation && (
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Example in {targetLanguage}:</span>
                        </div>
                        <div className="text-lg break-words">
                          {currentCard.example}
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Translation in {nativeLanguage}:</span>
                        </div>
                        <div className="text-lg break-words">
                          {currentCard.exampleTranslation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center text-sm text-white/60 mt-4">
                  In {nativeLanguage.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        {isFlipped && (
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleAnswer('incorrect')}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Incorrect</span>
            </button>
            <button
              onClick={() => handleAnswer('correct')}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Correct</span>
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-white text-gray-700 hover:bg-gray-100 rounded-xl font-semibold shadow-lg transition-all flex items-center space-x-2"
          >
            <SkipForward className="w-5 h-5" />
            <span>Skip</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    }>
      <StudyPageContent />
    </Suspense>
  )
}