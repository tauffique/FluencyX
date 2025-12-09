'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Volume2, StopCircle, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export default function ListeningStoryPage() {
  const router = useRouter()
  const params = useParams()
  const storyId = params.id as string

  const [story, setStory] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [listenCount, setListenCount] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const [evaluating, setEvaluating] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')

  useEffect(() => {
    const target = localStorage.getItem('targetLanguage') || 'es'
    const native = localStorage.getItem('nativeLanguage') || 'en'
    setTargetLanguage(target)
    setNativeLanguage(native)

    loadStory()
    
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis.cancel()
    }
  }, [storyId])

  const loadStory = async () => {
    setLoading(true)
    
    // Try to load from localStorage first
    const savedStories = localStorage.getItem('listeningStories')
    if (savedStories) {
      const stories = JSON.parse(savedStories)
      const foundStory = stories.find((s: any) => s.id === storyId)
      
      if (foundStory) {
        setStory(foundStory)
        
        // Generate story content and questions if not already done
        if (!foundStory.content) {
          await generateStoryContent(foundStory)
        } else {
          setQuestions(foundStory.questions || [])
        }
      }
    }
    
    setLoading(false)
  }

  const generateStoryContent = async (storyData: any) => {
    try {
      const response = await fetch('/api/generate-listening-story-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: storyData.title,
          difficulty: storyData.difficulty,
          category: storyData.category,
          targetLanguage,
          nativeLanguage
        })
      })

      const data = await response.json()
      
      // Update story with content
      const updatedStory = {
        ...storyData,
        content: data.content,
        questions: data.questions
      }
      
      setStory(updatedStory)
      setQuestions(data.questions)
      
      // Save to localStorage
      const savedStories = localStorage.getItem('listeningStories')
      if (savedStories) {
        const stories = JSON.parse(savedStories)
        const updatedStories = stories.map((s: any) => 
          s.id === storyId ? updatedStory : s
        )
        localStorage.setItem('listeningStories', JSON.stringify(updatedStories))
      }
    } catch (error) {
      console.error('Error generating story content:', error)
    }
  }

  const handlePlayAudio = async () => {
    if (listenCount >= 2) {
      alert('You have used both listening attempts. Please proceed to the questions.')
      return
    }

    if (isPlaying) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    setListenCount(prev => prev + 1)

    try {
      // Try Google TTS first
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: story.content,
          language: targetLanguage
        })
      })

      if (response.ok) {
        const data = await response.json()
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
        audioRef.current = audio
        
        audio.onended = () => {
          setIsPlaying(false)
          audioRef.current = null
        }
        
        audio.onerror = () => {
          setIsPlaying(false)
          audioRef.current = null
          useBrowserTTS()
        }
        
        await audio.play()
      } else {
        useBrowserTTS()
      }
    } catch (error) {
      console.error('TTS error:', error)
      useBrowserTTS()
    }
  }

  const useBrowserTTS = () => {
    const utterance = new SpeechSynthesisUtterance(story.content)
    utterance.lang = targetLanguage === 'es' ? 'es-ES' : targetLanguage
    utterance.rate = 0.9
    
    utterance.onend = () => {
      setIsPlaying(false)
    }
    
    utterance.onerror = () => {
      setIsPlaying(false)
    }
    
    window.speechSynthesis.speak(utterance)
  }

  const handleProceedToQuiz = () => {
    if (listenCount === 0) {
      alert('Please listen to the story at least once before proceeding to questions.')
      return
    }
    setShowQuiz(true)
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!quizSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [questionIndex]: optionIndex
      }))
    }
  }

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    setEvaluating(true)
    setQuizSubmitted(true)

    try {
      const response = await fetch('/api/evaluate-listening-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          answers,
          story: story.content,
          targetLanguage,
          nativeLanguage
        })
      })

      const data = await response.json()
      setEvaluation(data)

      // Update story completion
      const savedStories = localStorage.getItem('listeningStories')
      if (savedStories) {
        const stories = JSON.parse(savedStories)
        const updatedStories = stories.map((s: any) => 
          s.id === storyId ? { ...s, completed: true, score: data.score } : s
        )
        localStorage.setItem('listeningStories', JSON.stringify(updatedStories))
      }

      // Update stats
      updateStats(data.score)
    } catch (error) {
      console.error('Error evaluating quiz:', error)
    }

    setEvaluating(false)
  }

  const updateStats = (score: number) => {
    const savedStats = localStorage.getItem('listeningStats')
    let stats = savedStats ? JSON.parse(savedStats) : {
      totalCompleted: 0,
      averageScore: 0,
      currentStreak: 0,
      totalListeningTime: '0h'
    }

    stats.totalCompleted += 1
    stats.averageScore = Math.round(
      (stats.averageScore * (stats.totalCompleted - 1) + score) / stats.totalCompleted
    )

    localStorage.setItem('listeningStats', JSON.stringify(stats))
  }

  const handleNextStory = () => {
    router.push('/listening-practice')
  }

  const handleRetry = () => {
    setListenCount(0)
    setShowQuiz(false)
    setAnswers({})
    setQuizSubmitted(false)
    setEvaluation(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 text-xl mb-4">Story not found</p>
          <Link href="/listening-practice">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/listening-practice">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-semibold text-gray-700">
                Listens: {listenCount}/2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showQuiz ? (
          /* Listening Phase */
          <div>
            {/* Story Header */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 mb-8">
              <h1 className="font-sora text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {story.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-300">
                  {story.difficulty}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-300">
                  {story.category}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold border border-gray-300">
                  {story.duration}
                </span>
              </div>

              {/* Listen Warning */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Important: Listen Carefully!</h3>
                    <p className="text-sm text-yellow-800">
                      You can only listen to this story <strong>2 times</strong>. 
                      Make sure to pay attention and take notes if needed.
                    </p>
                    <p className="text-sm text-yellow-800 mt-2">
                      Remaining listens: <strong className="text-xl">{2 - listenCount}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handlePlayAudio}
                  disabled={listenCount >= 2 && !isPlaying}
                  className={`px-12 py-6 rounded-2xl font-bold text-lg flex items-center space-x-3 transition-all ${
                    listenCount >= 2 && !isPlaying
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isPlaying
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <StopCircle className="w-6 h-6" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-6 h-6" />
                      <span>{listenCount === 0 ? 'Start First Listen' : 'Start Second Listen'}</span>
                    </>
                  )}
                </button>

                {listenCount > 0 && (
                  <button
                    onClick={handleProceedToQuiz}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Proceed to Questions →
                  </button>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">💡 Listening Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Take notes while listening if allowed</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Focus on key information: who, what, where, when, why</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Don't worry if you don't understand every word</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pay attention to tone and emotion in the story</span>
                </li>
              </ul>
            </div>
          </div>
        ) : !quizSubmitted ? (
          /* Quiz Phase */
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 mb-8">
              <h2 className="font-sora text-2xl font-bold text-gray-900 mb-6">
                Comprehension Questions
              </h2>
              <p className="text-gray-600 mb-6">
                Answer the following questions based on what you heard:
              </p>

              <div className="space-y-8">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-4">
                      {qIndex + 1}. {q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerSelect(qIndex, oIndex)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            answers[qIndex] === oIndex
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                              answers[qIndex] === oIndex
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300'
                            }`}>
                              {answers[qIndex] === oIndex && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-gray-900">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < questions.length || evaluating}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  Object.keys(answers).length < questions.length || evaluating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105'
                }`}
              >
                {evaluating ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Evaluating...
                  </span>
                ) : (
                  'Submit Answers'
                )}
              </button>
            </div>
          </div>
        ) : evaluation ? (
          /* Results Phase */
          <div>
            <div className={`rounded-3xl p-8 shadow-xl border-2 mb-8 ${
              evaluation.score >= 80
                ? 'bg-green-50 border-green-300'
                : evaluation.score >= 60
                ? 'bg-blue-50 border-blue-300'
                : 'bg-orange-50 border-orange-300'
            }`}>
              <div className="text-center mb-6">
                <h2 className="font-sora text-3xl font-bold text-gray-900 mb-4">
                  Your Results
                </h2>
                <div className="text-6xl font-bold mb-2" style={{
                  color: evaluation.score >= 80 ? '#16a34a' : evaluation.score >= 60 ? '#2563eb' : '#ea580c'
                }}>
                  {evaluation.score}%
                </div>
                <p className="text-lg text-gray-700">
                  {evaluation.score >= 80 ? 'Excellent! 🎉' : evaluation.score >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪'}
                </p>
              </div>

              {/* AI Feedback */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">📝 AI Feedback:</h3>
                <p className="text-gray-700">{evaluation.feedback}</p>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                {questions.map((q, qIndex) => {
                  const isCorrect = answers[qIndex] === q.correctAnswer
                  return (
                    <div
                      key={qIndex}
                      className={`p-4 rounded-xl ${
                        isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">{q.question}</p>
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Your answer: {q.options[answers[qIndex]]}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700 mt-1">
                              Correct answer: {q.options[q.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                {evaluation.score < 60 && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleNextStory}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {evaluation.score >= 60 ? 'Next Story →' : 'Back to Stories'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Loading evaluation */
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}