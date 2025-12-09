'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Volume2, Mic, StopCircle, Loader, CheckCircle, XCircle } from 'lucide-react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

interface Scenario {
  situation: string
  prompt: string
  suggestedLength: string
  difficulty: string
}

interface Evaluation {
  overallScore: number
  grammar: { score: number; feedback: string }
  vocabulary: { score: number; feedback: string }
  fluency: { score: number; feedback: string }
  pronunciation: { score: number; feedback: string }
  transcription: string
  feedbackNative: string
  correctedVersion: string
  suggestions: string[]
}

function SpeakingSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'general'

  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [userLevel, setUserLevel] = useState('')
  
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loadingScenario, setLoadingScenario] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get user settings
    const target = localStorage.getItem('targetLanguage') || 'es'
    const native = localStorage.getItem('nativeLanguage') || 'en'
    const level = localStorage.getItem('userLevel') || 'beginner'
    
    setTargetLanguage(target)
    setNativeLanguage(native)
    setUserLevel(level)

    // Generate scenario
    generateScenario(target, native, level, category)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [category])

  const generateScenario = async (target: string, native: string, level: string, cat: string) => {
    setLoadingScenario(true)
    
    try {
      const response = await fetch('/api/generate-speaking-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: target,
          nativeLanguage: native,
          userLevel: level,
          category: cat
        })
      })

      const data = await response.json()
      setScenario(data.scenario)
    } catch (error) {
      console.error('Error generating scenario:', error)
      alert('Failed to generate scenario. Please try again.')
    }
    
    setLoadingScenario(false)
  }

  const handlePlayScenario = () => {
    if (!scenario) return

    const utterance = new SpeechSynthesisUtterance(scenario.prompt)
    utterance.lang = targetLanguage === 'es' ? 'es-ES' : targetLanguage
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleSubmit = async () => {
    if (!audioBlob || !scenario) return

    setEvaluating(true)

    try {
      // Convert audio blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string

        const response = await fetch('/api/evaluate-speaking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64Audio,
            scenario: scenario.prompt,
            targetLanguage,
            nativeLanguage,
            userLevel
          })
        })

        const data = await response.json()
        setEvaluation(data.evaluation)

        // Update stats
        const stats = JSON.parse(localStorage.getItem('speakingStats') || '{}')
        const newStats = {
          totalSessions: (stats.totalSessions || 0) + 1,
          averageScore: Math.round(((stats.averageScore || 0) * (stats.totalSessions || 0) + data.evaluation.overallScore) / ((stats.totalSessions || 0) + 1)),
          streak: (stats.streak || 0) + 1,
          bestScore: Math.max(stats.bestScore || 0, data.evaluation.overallScore)
        }
        localStorage.setItem('speakingStats', JSON.stringify(newStats))
      }
    } catch (error) {
      console.error('Error evaluating speech:', error)
      alert('Failed to evaluate speech. Please try again.')
    }

    setEvaluating(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  if (loadingScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 text-xl font-semibold">Generating Speaking Scenario...</p>
          <p className="text-gray-600">Creating a personalized practice session for you</p>
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
            <Link href="/speaking-practice">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            {!evaluation && (
              <div className="text-gray-900 font-semibold">
                {category.charAt(0).toUpperCase() + category.slice(1)} Practice
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!evaluation ? (
          <>
            {/* Scenario Card */}
            {scenario && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 mb-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-sora text-2xl font-bold text-gray-900">Scenario</h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {scenario.difficulty}
                    </span>
                  </div>
                  <div className="bg-indigo-50 rounded-2xl p-6 mb-4">
                    <p className="text-gray-700 text-lg mb-2">{scenario.situation}</p>
                    <div className="border-t border-indigo-200 pt-4 mt-4">
                      <p className="text-gray-900 font-semibold text-xl">{scenario.prompt}</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePlayScenario}
                    className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-all flex items-center space-x-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>Listen to Prompt</span>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> {scenario.suggestedLength}. Speak naturally and try to use vocabulary appropriate for your level.
                  </p>
                </div>

                {/* Recording Controls */}
                <div className="text-center">
                  {!isRecording && !audioBlob && (
                    <button
                      onClick={startRecording}
                      className="px-12 py-6 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-3 mx-auto"
                    >
                      <Mic className="w-6 h-6" />
                      <span>Start Recording</span>
                    </button>
                  )}

                  {isRecording && (
                    <div>
                      <div className="mb-6">
                        <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Mic className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-gray-600">Recording... (max 60 seconds)</p>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="px-12 py-6 bg-gray-800 text-white font-bold text-lg rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center space-x-3 mx-auto"
                      >
                        <StopCircle className="w-6 h-6" />
                        <span>Stop Recording</span>
                      </button>
                    </div>
                  )}

                  {audioBlob && !isRecording && !evaluating && (
                    <div>
                      <div className="mb-6">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-900 font-semibold text-lg mb-2">Recording Complete!</p>
                        <p className="text-gray-600">Duration: {recordingTime} seconds</p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => {
                            setAudioBlob(null)
                            setRecordingTime(0)
                          }}
                          className="px-8 py-4 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                          Record Again
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                          Get AI Evaluation
                        </button>
                      </div>
                    </div>
                  )}

                  {evaluating && (
                    <div className="text-center py-8">
                      <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-900 font-semibold text-lg mb-2">AI is Evaluating Your Speech...</p>
                      <p className="text-gray-600">Analyzing grammar, vocabulary, fluency, and pronunciation</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Evaluation Results */
          <div className="space-y-6">
            {/* Overall Score */}
            <div className={`rounded-3xl p-8 shadow-lg border-2 ${getScoreBgColor(evaluation.overallScore)}`}>
              <div className="text-center">
                <h2 className="font-sora text-2xl font-bold text-gray-900 mb-4">Your Score</h2>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}%
                </div>
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-3xl">
                      {evaluation.overallScore >= star * 20 ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-lg">
                  {evaluation.overallScore >= 80 ? 'Excellent Work!' : evaluation.overallScore >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </p>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-6">Detailed Breakdown</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Grammar', data: evaluation.grammar },
                  { label: 'Vocabulary', data: evaluation.vocabulary },
                  { label: 'Fluency', data: evaluation.fluency },
                  { label: 'Pronunciation', data: evaluation.pronunciation }
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <span className={`font-bold ${getScoreColor(item.data.score)}`}>{item.data.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${item.data.score >= 80 ? 'bg-green-500' : item.data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.data.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{item.data.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback in Native Language */}
            <div className="bg-blue-50 rounded-3xl p-8 shadow-lg border-2 border-blue-200">
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-4">Feedback (in your language)</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{evaluation.feedbackNative}</p>
            </div>

            {/* What You Said */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-4">What You Said</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-800 italic">"{evaluation.transcription}"</p>
              </div>
              
              {evaluation.correctedVersion && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-2">Corrected Version:</h4>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-gray-800">"{evaluation.correctedVersion}"</p>
                  </div>
                </>
              )}
            </div>

            {/* Suggestions */}
            {evaluation.suggestions && evaluation.suggestions.length > 0 && (
              <div className="bg-purple-50 rounded-3xl p-8 shadow-lg border-2 border-purple-200">
                <h3 className="font-sora text-xl font-bold text-gray-900 mb-4">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {evaluation.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/speaking-practice')}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Back to Hub
              </button>
              <button
                onClick={() => {
                  setEvaluation(null)
                  setAudioBlob(null)
                  setRecordingTime(0)
                  generateScenario(targetLanguage, nativeLanguage, userLevel, category)
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Try Another Scenario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SpeakingSession() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    }>
      <SpeakingSessionContent />
    </Suspense>
  )
}