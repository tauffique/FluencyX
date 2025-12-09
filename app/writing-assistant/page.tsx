'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileEdit, Loader2, CheckCircle, AlertCircle, Lightbulb, TrendingUp, BookOpen, Zap } from 'lucide-react'

interface Evaluation {
  overallScore: number
  grammar: {
    score: number
    issues: string[]
    corrections: string[]
  }
  vocabulary: {
    score: number
    strengths: string[]
    improvements: string[]
  }
  sentenceStructure: {
    score: number
    analysis: string[]
  }
  coherence: {
    score: number
    feedback: string
  }
  tips: string[]
  correctedText: string
  detailedFeedback: string
}

export default function WritingAssistantPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [proficiencyLevel, setProficiencyLevel] = useState('')
  const [showCorrectedText, setShowCorrectedText] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const target = localStorage.getItem('targetLanguage')
    const native = localStorage.getItem('nativeLanguage') || 'en'
    const level = localStorage.getItem('proficiencyLevel')
    
    if (target) setTargetLanguage(target)
    setNativeLanguage(native)
    if (level) setProficiencyLevel(level)
  }, [])

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian'
    }
    return names[code] || code.toUpperCase()
  }

  // Determine if feedback should be in native language
  // A0-A2: Native language, B1+: Target language
  const shouldUseNativeLanguage = () => {
    return ['A0', 'A1', 'A2'].includes(proficiencyLevel)
  }

  const getFeedbackLanguage = () => {
    return shouldUseNativeLanguage() ? nativeLanguage : targetLanguage
  }

  const handleEvaluate = async () => {
    if (!text.trim() || isEvaluating) return

    setIsEvaluating(true)
    setEvaluation(null)

    try {
      const response = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLanguage: targetLanguage,
          nativeLanguage: nativeLanguage,
          proficiencyLevel: proficiencyLevel,
          feedbackLanguage: getFeedbackLanguage()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate writing')
      }

      const data = await response.json()
      setEvaluation(data.evaluation)
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('Failed to evaluate your writing. Please check your API configuration.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-blue-500 to-indigo-600'
    if (score >= 40) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-rose-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Needs Work'
    return 'Keep Practicing'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
              <h1 className="font-sora text-lg font-bold text-gray-900">Writing Assistant</h1>
              <p className="text-xs text-gray-500">
                {getLanguageName(targetLanguage)} • Level {proficiencyLevel}
              </p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <FileEdit className="w-10 h-10" />
            <div>
              <h2 className="font-sora text-3xl font-bold">Writing Assistant</h2>
              <p className="text-white/90">Improve your writing with AI-powered feedback</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Language</div>
              <div className="font-bold text-lg">{getLanguageName(targetLanguage)}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Your Level</div>
              <div className="font-bold text-lg">{proficiencyLevel}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Feedback In</div>
              <div className="font-bold text-lg">
                {shouldUseNativeLanguage() ? getLanguageName(nativeLanguage) : getLanguageName(targetLanguage)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Writing Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sora text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <FileEdit className="w-5 h-5 text-orange-600" />
                  <span>Your Writing</span>
                </h3>
                <div className="text-sm text-gray-500">
                  {text.length} characters
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Write something in ${getLanguageName(targetLanguage)}... \n\nYou can write:\n• A sentence\n• A paragraph\n• A short story\n• An essay\n• Anything you want!`}
                className="w-full h-96 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-base"
                disabled={isEvaluating}
              />

              <div className="mt-4">
                <button
                  onClick={handleEvaluate}
                  disabled={!text.trim() || isEvaluating}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                    text.trim() && !isEvaluating
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Evaluate My Writing</span>
                    </>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Tips for best results:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Write at least 2-3 sentences</li>
                      <li>• Use proper punctuation</li>
                      <li>• Try your best grammar</li>
                      <li>• Be creative and express yourself!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Results Section */}
          <div className="space-y-6">
            {isEvaluating && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  AI is analyzing your writing...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This may take 10-15 seconds
                </p>
              </div>
            )}

            {!isEvaluating && !evaluation && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                <FileEdit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  No evaluation yet
                </p>
                <p className="text-gray-500 text-sm">
                  Write something and click "Evaluate" to get detailed feedback
                </p>
              </div>
            )}

            {evaluation && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className={`bg-gradient-to-r ${getScoreColor(evaluation.overallScore)} rounded-2xl shadow-lg p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sora text-2xl font-bold">Overall Score</h3>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="flex items-end space-x-3">
                    <div className="text-6xl font-bold">{evaluation.overallScore}</div>
                    <div className="text-2xl font-semibold pb-2">/100</div>
                  </div>
                  <div className="text-xl mt-2 text-white/90">
                    {getScoreLabel(evaluation.overallScore)}
                  </div>
                </div>

                {/* Category Scores */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <h3 className="font-sora text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>

                  {/* Grammar */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Grammar</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getScoreColor(evaluation.grammar.score)} text-white`}>
                        {evaluation.grammar.score}/100
                      </span>
                    </div>
                    {evaluation.grammar.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {evaluation.grammar.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {evaluation.grammar.corrections.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {evaluation.grammar.corrections.map((correction, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{correction}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vocabulary */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Vocabulary</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getScoreColor(evaluation.vocabulary.score)} text-white`}>
                        {evaluation.vocabulary.score}/100
                      </span>
                    </div>
                    {evaluation.vocabulary.strengths.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Strengths:</p>
                        {evaluation.vocabulary.strengths.map((strength, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{strength}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {evaluation.vocabulary.improvements.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Can Improve:</p>
                        {evaluation.vocabulary.improvements.map((improvement, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sentence Structure */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Sentence Structure</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getScoreColor(evaluation.sentenceStructure.score)} text-white`}>
                        {evaluation.sentenceStructure.score}/100
                      </span>
                    </div>
                    {evaluation.sentenceStructure.analysis.map((item, idx) => (
                      <div key={idx} className="mt-2 text-sm text-gray-700">
                        • {item}
                      </div>
                    ))}
                  </div>

                  {/* Coherence */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Coherence & Flow</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getScoreColor(evaluation.coherence.score)} text-white`}>
                        {evaluation.coherence.score}/100
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{evaluation.coherence.feedback}</p>
                  </div>
                </div>

                {/* Corrected Text */}
                {evaluation.correctedText && evaluation.correctedText !== text && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <button
                      onClick={() => setShowCorrectedText(!showCorrectedText)}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <h3 className="font-sora text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Corrected Version</span>
                      </h3>
                      <span className="text-sm text-gray-500">
                        {showCorrectedText ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    {showCorrectedText && (
                      <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <p className="text-gray-800 whitespace-pre-wrap">{evaluation.correctedText}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Learning Tips */}
                {evaluation.tips.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="font-sora text-xl font-bold mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-6 h-6" />
                      <span>Tips to Improve</span>
                    </h3>
                    <div className="space-y-3">
                      {evaluation.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-white/95">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Feedback */}
                {evaluation.detailedFeedback && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      <span>Detailed Feedback</span>
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {evaluation.detailedFeedback}
                    </p>
                  </div>
                )}

                {/* Try Again Button */}
                <button
                  onClick={() => {
                    setEvaluation(null)
                    setText('')
                  }}
                  className="w-full px-6 py-4 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all"
                >
                  Write Something New
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}