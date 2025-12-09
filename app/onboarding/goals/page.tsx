'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Target, Clock, Coffee, Zap, Flame, Rocket, Sparkles } from 'lucide-react'

const TIME_GOALS = [
  {
    duration: 5,
    name: 'Casual',
    description: 'Quick daily practice',
    icon: Coffee,
    color: 'from-amber-400 to-orange-500',
    commitment: 'Light',
    result: 'Build habits gradually',
    popular: false
  },
  {
    duration: 10,
    name: 'Relaxed',
    description: 'Steady progress',
    icon: Clock,
    color: 'from-green-400 to-emerald-500',
    commitment: 'Easy',
    result: 'Consistent improvement',
    popular: false
  },
  {
    duration: 20,
    name: 'Serious',
    description: 'Balanced learning',
    icon: Zap,
    color: 'from-blue-400 to-indigo-500',
    commitment: 'Moderate',
    result: 'Great progress',
    popular: true
  },
  {
    duration: 30,
    name: 'Dedicated',
    description: 'Fast improvement',
    icon: Flame,
    color: 'from-purple-400 to-pink-500',
    commitment: 'High',
    result: 'Rapid learning',
    popular: false
  },
  {
    duration: 60,
    name: 'Intensive',
    description: 'Maximum results',
    icon: Rocket,
    color: 'from-pink-400 to-rose-500',
    commitment: 'Very High',
    result: 'Fastest path',
    popular: false
  },
]

export default function GoalsPage() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState(20)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [proficiencyLevel, setProficiencyLevel] = useState('')

  useEffect(() => {
    const target = localStorage.getItem('targetLanguage')
    const level = localStorage.getItem('proficiencyLevel')
    
    if (target) setTargetLanguage(target)
    if (level) setProficiencyLevel(level)
  }, [])

  const handleContinue = () => {
    if (selectedGoal) {
      localStorage.setItem('dailyGoal', selectedGoal.toString())
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    router.push('/onboarding/level')
  }

  const selectedTimeGoal = TIME_GOALS.find(goal => goal.duration === selectedGoal)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
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
              <div className="w-8 h-1.5 rounded-full bg-green-500"></div>
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-200 animate-float">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-sora text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Set Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Daily Goal</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              How much time can you dedicate to learning each day?
            </p>
            
            {/* User Summary */}
            {targetLanguage && proficiencyLevel && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="bg-white rounded-full px-5 py-2 shadow-md border border-indigo-100">
                  <span className="text-gray-600">Learning: </span>
                  <span className="font-bold text-indigo-600">{targetLanguage.toUpperCase()}</span>
                </div>
                <div className="bg-white rounded-full px-5 py-2 shadow-md border border-purple-100">
                  <span className="text-gray-600">Level: </span>
                  <span className="font-bold text-purple-600">{proficiencyLevel}</span>
                </div>
              </div>
            )}
          </div>

          {/* Time Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {TIME_GOALS.map((goal, index) => {
              const IconComponent = goal.icon
              const isSelected = selectedGoal === goal.duration
              
              return (
                <button
                  key={goal.duration}
                  onClick={() => setSelectedGoal(goal.duration)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`text-left transition-all duration-300 animate-slideUp relative rounded-3xl overflow-hidden ${
                    isSelected
                      ? 'scale-105 shadow-2xl'
                      : 'hover:scale-102 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {goal.popular && (
                    <div className="absolute -top-3 right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>POPULAR</span>
                      </div>
                    </div>
                  )}

                  <div className={`bg-white rounded-3xl p-6 border-2 ${
                    isSelected ? 'border-indigo-400' : 'border-gray-100'
                  } relative overflow-hidden`}>
                    {/* Background gradient on select */}
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-5`}></div>
                    )}

                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center shadow-lg mb-4 transform transition-transform ${
                        isSelected ? 'scale-110' : ''
                      }`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-sora text-2xl font-bold text-gray-900">
                            {goal.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${goal.color} text-white`}>
                            {goal.duration} min
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">
                          {goal.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${goal.color}`}></div>
                          <span className="text-gray-500">Effort:</span>
                          <span className="font-semibold text-gray-700">{goal.commitment}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${goal.color}`}></div>
                          <span className="text-gray-500">Result:</span>
                          <span className="font-semibold text-gray-700">{goal.result}</span>
                        </div>
                      </div>

                      {/* Select indicator */}
                      {isSelected && (
                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center shadow-lg`}>
                          <Sparkles className="w-5 h-5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Motivation Box */}
          {selectedTimeGoal && (
            <div className={`bg-white rounded-3xl p-6 shadow-xl border-2 border-indigo-100 mb-8 animate-slideUp`}>
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedTimeGoal.color} flex items-center justify-center`}>
                  <selectedTimeGoal.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    Great choice! With {selectedTimeGoal.duration} minutes daily:
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedTimeGoal.color}`}></div>
                      <span>Complete ~{Math.round(selectedTimeGoal.duration / 5)} lessons per day</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedTimeGoal.color}`}></div>
                      <span>Learn ~{selectedTimeGoal.duration * 2} new words per week</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedTimeGoal.color}`}></div>
                      <span>Reach next milestone in ~{Math.ceil(30 / (selectedTimeGoal.duration / 20))} days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

         

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className={`group px-12 py-5 rounded-2xl font-bold text-xl flex items-center space-x-3 transition-all duration-300 ${
                selectedGoal
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Start Learning</span>
              <ArrowRight className={`w-6 h-6 transition-transform ${
                selectedGoal ? 'group-hover:translate-x-1' : ''
              }`} />
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            You're all set! Let's begin your language learning journey 🎉
          </p>
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