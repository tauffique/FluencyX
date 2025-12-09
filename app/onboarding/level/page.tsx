'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Trophy, Star, Zap } from 'lucide-react'

const LEVELS = [
  {
    code: 'A0',
    name: 'Absolute Beginner',
    description: 'Starting from scratch',
    icon: '🌱',
    color: 'from-emerald-400 to-teal-500',
    examples: ['Never studied', 'Know 0-10 words', 'Complete beginner']
  },
  {
    code: 'A1',
    name: 'Beginner',
    description: 'Basic words and phrases',
    icon: '🌿',
    color: 'from-green-400 to-emerald-500',
    examples: ['Simple greetings', 'Basic questions', 'Everyday phrases']
  },
  {
    code: 'A2',
    name: 'Elementary',
    description: 'Simple conversations',
    icon: '🌳',
    color: 'from-lime-400 to-green-500',
    examples: ['Order food', 'Ask directions', 'Daily routine']
  },
  {
    code: 'B1',
    name: 'Intermediate',
    description: 'Everyday situations',
    icon: '🚀',
    color: 'from-blue-400 to-indigo-500',
    examples: ['Describe experiences', 'Express opinions', 'Main points']
  },
  {
    code: 'B2',
    name: 'Upper Intermediate',
    description: 'Comfortable conversations',
    icon: '⚡',
    color: 'from-indigo-400 to-purple-500',
    examples: ['Argue viewpoints', 'Complex texts', 'Spontaneous speech']
  },
  {
    code: 'C1',
    name: 'Advanced',
    description: 'Fluent and flexible',
    icon: '⭐',
    color: 'from-purple-400 to-pink-500',
    examples: ['Effective use', 'Implicit meaning', 'Clear texts']
  },
  {
    code: 'C2',
    name: 'Proficient',
    description: 'Near-native fluency',
    icon: '👑',
    color: 'from-pink-400 to-rose-500',
    examples: ['Understand everything', 'Subtle meanings', 'Native-like']
  },
]

export default function LevelAssessmentPage() {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')

  useEffect(() => {
    const target = localStorage.getItem('targetLanguage')
    if (target) setTargetLanguage(target)
  }, [])

  const handleContinue = () => {
    if (selectedLevel) {
      localStorage.setItem('proficiencyLevel', selectedLevel)
      router.push('/onboarding/goals')
    }
  }

  const handleBack = () => {
    router.push('/onboarding/language')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1.5 rounded-full bg-green-500"></div>
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl shadow-purple-200 animate-float">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-sora text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              What's Your <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">Level?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Choose the level that best describes your current abilities
            </p>
            {targetLanguage && (
              <div className="inline-block bg-white rounded-full px-6 py-2 shadow-lg border border-indigo-100">
                <span className="text-gray-600">Learning: </span>
                <span className="font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">{targetLanguage.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Levels Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {LEVELS.map((level, index) => (
              <button
                key={level.code}
                onClick={() => setSelectedLevel(level.code)}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={`text-left transition-all duration-300 animate-slideUp rounded-3xl overflow-hidden ${
                  selectedLevel === level.code
                    ? 'scale-105 shadow-2xl'
                    : 'hover:scale-102 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`bg-white rounded-3xl p-6 border-2 ${
                  selectedLevel === level.code
                    ? 'border-purple-400'
                    : 'border-gray-100'
                } relative overflow-hidden`}>
                  {/* Background gradient on select */}
                  {selectedLevel === level.code && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5`}></div>
                  )}

                  <div className="relative flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg transform transition-transform ${
                      selectedLevel === level.code ? 'scale-110' : ''
                    }`}>
                      <span className="text-3xl">{level.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${level.color} text-white shadow-md`}>
                          {level.code}
                        </span>
                        <h3 className="font-sora text-xl font-bold text-gray-900">
                          {level.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3 font-medium">
                        {level.description}
                      </p>
                      
                      {/* Examples */}
                      <div className="flex flex-wrap gap-2">
                        {level.examples.map((example, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Check mark */}
                    {selectedLevel === level.code && (
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}>
                          <Star className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

         

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedLevel}
              className={`group px-12 py-5 rounded-2xl font-bold text-xl flex items-center space-x-3 transition-all duration-300 ${
                selectedLevel
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl shadow-pink-200 hover:shadow-2xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className={`w-6 h-6 transition-transform ${
                selectedLevel ? 'group-hover:translate-x-1' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}