'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Volume2, StopCircle, Loader2, BookOpen, CheckCircle } from 'lucide-react'

interface Story {
  id: string
  title: string
  preview: string
  content: string
  level: string
  wordCount: number
  timestamp: number
}

export default function StoryReaderPage() {
  const router = useRouter()
  const params = useParams()
  const storyId = params.id as string

  const [story, setStory] = useState<Story | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [translation, setTranslation] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('en') // Default to English

  useEffect(() => {
    // Get target AND native languages
    const target = localStorage.getItem('targetLanguage')
    const native = localStorage.getItem('nativeLanguage') || 'en' // Default to English if not set
    
    if (target) setTargetLanguage(target)
    setNativeLanguage(native)

    // Load story from localStorage
    const savedStories = localStorage.getItem('readingHubStories')
    if (savedStories) {
      const stories: Story[] = JSON.parse(savedStories)
      const foundStory = stories.find(s => s.id === storyId)
      if (foundStory) {
        setStory(foundStory)
      } else {
        router.push('/reading-hub')
      }
    } else {
      router.push('/reading-hub')
    }
  }, [storyId, router])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const handleSpeak = async () => {
    if (!story) return

    if (isSpeaking) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    try {
      setIsSpeaking(true)
      
      // Call TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story.content,
          language: targetLanguage
        })
      })

      if (!response.ok) {
        throw new Error('TTS failed')
      }

      const data = await response.json()
      
      // Play audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsSpeaking(false)
        audioRef.current = null
      }
      
      audio.onerror = () => {
        setIsSpeaking(false)
        audioRef.current = null
        // Fallback to browser TTS
        useBrowserTTS()
      }
      
      audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to browser TTS
      useBrowserTTS()
    }
  }

  const useBrowserTTS = () => {
    if (!story) return
    
    const utterance = new SpeechSynthesisUtterance(story.content)
    utterance.lang = targetLanguage
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handleWordClick = async (word: string) => {
    // Clean the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:()"""'']/g, '').trim()
    
    if (!cleanWord || cleanWord.length < 2) return

    setSelectedWord(cleanWord)
    setIsTranslating(true)
    setTranslation(null)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanWord,
          sourceLanguage: targetLanguage, // Translate FROM target language
          targetLanguage: nativeLanguage  // Translate TO native language (English)
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      setTranslation(data.translation)
    } catch (error) {
      console.error('Translation error:', error)
      setTranslation('Translation unavailable')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleFinishReading = () => {
    setShowQuiz(true)
  }

  const renderStoryWithClickableWords = () => {
    if (!story) return null

    const paragraphs = story.content.split('\n\n')
    
    return paragraphs.map((paragraph, pIndex) => {
      const words = paragraph.split(' ')
      
      return (
        <p key={pIndex} className="mb-4 leading-relaxed">
          {words.map((word, wIndex) => (
            <span key={`${pIndex}-${wIndex}`}>
              <button
                onClick={() => handleWordClick(word)}
                className="hover:bg-yellow-100 hover:text-purple-700 transition-colors rounded px-0.5 cursor-pointer"
              >
                {word}
              </button>
              {wIndex < words.length - 1 && ' '}
            </span>
          ))}
        </p>
      )
    })
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (showQuiz) {
    return <QuizSection story={story} onBack={() => setShowQuiz(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/reading-hub">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSpeak}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <StopCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Listen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Story Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-sora text-3xl font-bold mb-2">{story.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  Level: {story.level}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {story.wordCount} words
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-blue-900 text-sm">
            💡 <strong>Tip:</strong> Click on any word to see its translation in your native language!
          </p>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <div className="prose prose-lg max-w-none text-gray-800 text-lg">
            {renderStoryWithClickableWords()}
          </div>
        </div>

        {/* Word Translation Popup */}
        {selectedWord && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-200 max-w-sm w-full mx-4 z-50 animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Selected Word</div>
                <div className="font-bold text-xl text-gray-900">{selectedWord}</div>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="border-t pt-3">
              <div className="text-sm text-gray-500 mb-1">Translation</div>
              {isTranslating ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-gray-600">Translating...</span>
                </div>
              ) : (
                <div className="font-semibold text-lg text-purple-700">{translation}</div>
              )}
            </div>
          </div>
        )}

        {/* Finish Reading Button */}
        <div className="flex justify-center">
          <button
            onClick={handleFinishReading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Finish Reading & Take Quiz →
          </button>
        </div>
      </div>
    </div>
  )
}

// Quiz Section Component
function QuizSection({ story, onBack }: { story: Story; onBack: () => void }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)

  useEffect(() => {
    generateQuiz()
  }, [])

  const generateQuiz = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyContent: story.content,
          storyTitle: story.title
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuiz(data.quiz)
    } catch (error) {
      console.error('Quiz generation error:', error)
      alert('Failed to generate quiz. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }))
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < (quiz?.questions?.length || 0)) {
      alert('Please answer all questions before submitting!')
      return
    }

    setIsEvaluating(true)
    try {
      const response = await fetch('/api/evaluate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz: quiz,
          answers: answers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate quiz')
      }

      const data = await response.json()
      setEvaluation(data.evaluation)
    } catch (error) {
      console.error('Quiz evaluation error:', error)
      alert('Failed to evaluate quiz. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Generating your comprehension quiz...</p>
        </div>
      </div>
    )
  }

  if (evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Results Header */}
          <div className={`rounded-3xl p-8 text-white mb-8 shadow-xl ${
            evaluation.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            evaluation.score >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
            'bg-gradient-to-r from-orange-500 to-red-600'
          }`}>
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="font-sora text-3xl font-bold mb-2">Quiz Complete!</h2>
              <div className="text-5xl font-bold mb-2">{evaluation.score}%</div>
              <p className="text-xl">{evaluation.feedback}</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="font-bold text-xl mb-4">Detailed Results</h3>
            <div className="space-y-4">
              {evaluation.details.map((detail: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    detail.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold">Question {index + 1}</span>
                    {detail.correct ? (
                      <span className="text-green-600 font-bold">✓ Correct</span>
                    ) : (
                      <span className="text-red-600 font-bold">✗ Incorrect</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{quiz.questions[index].question}</p>
                  <div className="text-sm">
                    <p className="text-gray-600">Your answer: <span className="font-semibold">{detail.userAnswer}</span></p>
                    {!detail.correct && (
                      <p className="text-green-600 mt-1">Correct answer: <span className="font-semibold">{detail.correctAnswer}</span></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Link href="/reading-hub" className="flex-1">
              <button className="w-full px-6 py-4 bg-white border-2 border-purple-200 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all">
                ← Back to Stories
              </button>
            </Link>
            <Link href="/reading-hub" className="flex-1">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                Next Story →
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <button onClick={onBack} className="text-white/80 hover:text-white mb-4 flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Story</span>
          </button>
          <h2 className="font-sora text-3xl font-bold mb-2">Comprehension Quiz</h2>
          <p className="text-white/90">Test your understanding of "{story.title}"</p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {quiz?.questions?.map((q: any, index: number) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="font-semibold text-lg text-gray-900">{q.question}</p>
              </div>
              
              <div className="space-y-2 ml-11">
                {q.options.map((option: string, optIndex: number) => (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[index] === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitQuiz}
          disabled={isEvaluating || Object.keys(answers).length < (quiz?.questions?.length || 0)}
          className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all ${
            isEvaluating || Object.keys(answers).length < (quiz?.questions?.length || 0)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
          }`}
        >
          {isEvaluating ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Evaluating...</span>
            </span>
          ) : (
            'Submit Quiz'
          )}
        </button>
      </div>
    </div>
  )
}