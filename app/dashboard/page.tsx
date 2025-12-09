'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, MessageSquare, Mic, FileEdit, CreditCard, BarChart3, Settings, Headphones } from 'lucide-react'

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    targetLanguage: '',
    proficiencyLevel: '',
    dailyGoal: 0
  })

  useEffect(() => {
    // Get user data from localStorage
    const target = localStorage.getItem('targetLanguage')
    const level = localStorage.getItem('proficiencyLevel')
    const goal = localStorage.getItem('dailyGoal')

    setUserData({
      targetLanguage: target || '',
      proficiencyLevel: level || '',
      dailyGoal: parseInt(goal || '20')
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <span className="font-sora text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LinguaFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/analytics">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </Link>
              <Link href="/onboarding/language">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <h1 className="font-sora text-4xl font-bold mb-4">
            Welcome to Your Dashboard! 🎉
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Your personalized learning experience is ready
          </p>
          
          {/* User Info */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Learning</div>
              <div className="font-bold text-lg">{userData.targetLanguage.toUpperCase()}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Level</div>
              <div className="font-bold text-lg">{userData.proficiencyLevel}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Daily Goal</div>
              <div className="font-bold text-lg">{userData.dailyGoal} min</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card: AI Chatbot */}
          <Link href="/chatbot">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-indigo-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">AI Chatbot</h3>
              <p className="text-gray-600 mb-4">Practice conversations with AI</p>
              <span className="text-sm text-indigo-600 font-semibold">Start Chatting →</span>
            </div>
          </Link>

          {/* Feature Card: Reading Hub */}
          <Link href="/reading-hub">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-pink-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Reading Hub</h3>
              <p className="text-gray-600 mb-4">Stories and articles for practice</p>
              <span className="text-sm text-pink-600 font-semibold">Start Reading →</span>
            </div>
          </Link>

          {/* Feature Card: Listening Practice */}
          <Link href="/listening-practice">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Listening Comprehension</h3>
              <p className="text-gray-600 mb-4">IELTS/DAF style listening tests</p>
              <span className="text-sm text-blue-600 font-semibold">Start Listening →</span>
            </div>
          </Link>

          {/* Feature Card: Speaking Practice */}
          <Link href="/speaking-practice">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-teal-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Speaking Practice</h3>
              <p className="text-gray-600 mb-4">Speak scenarios & get AI evaluation</p>
              <span className="text-sm text-teal-600 font-semibold">Start Practice →</span>
            </div>
          </Link>

          {/* Feature Card: Writing Assistant */}
          <Link href="/writing-assistant">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-amber-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                <FileEdit className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Writing Assistant</h3>
              <p className="text-gray-600 mb-4">Improve your writing skills</p>
              <span className="text-sm text-amber-600 font-semibold">Start Writing →</span>
            </div>
          </Link>

          {/* Feature Card: Flashcards */}
          <Link href="/flashcards">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-violet-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-gray-900 mb-2">Flashcards</h3>
              <p className="text-gray-600 mb-4">Master vocabulary daily</p>
              <span className="text-sm text-violet-600 font-semibold">Start Learning →</span>
            </div>
          </Link>

          
        </div>
        

        
      </div>
    </div>
  )
}