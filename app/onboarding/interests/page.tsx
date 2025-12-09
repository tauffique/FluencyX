'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const interests = [
  { id: 'travel', name: 'Travel & Culture', icon: '✈️', color: 'from-blue-500 to-cyan-600' },
  { id: 'business', name: 'Business & Career', icon: '💼', color: 'from-indigo-500 to-purple-600' },
  { id: 'food', name: 'Food & Cooking', icon: '🍳', color: 'from-orange-500 to-red-600' },
  { id: 'tech', name: 'Technology', icon: '💻', color: 'from-violet-500 to-purple-600' },
  { id: 'arts', name: 'Arts & Entertainment', icon: '🎨', color: 'from-pink-500 to-rose-600' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', color: 'from-green-500 to-emerald-600' },
  { id: 'science', name: 'Science & Nature', icon: '🔬', color: 'from-teal-500 to-cyan-600' },
  { id: 'health', name: 'Health & Wellness', icon: '🧘', color: 'from-lime-500 to-green-600' },
  { id: 'music', name: 'Music', icon: '🎵', color: 'from-purple-500 to-pink-600' },
  { id: 'reading', name: 'Reading & Writing', icon: '📚', color: 'from-amber-500 to-orange-600' },
  { id: 'family', name: 'Family & Relationships', icon: '👨‍👩‍👧‍👦', color: 'from-rose-500 to-pink-600' },
  { id: 'education', name: 'Education', icon: '🎓', color: 'from-blue-500 to-indigo-600' },
]

export default function InterestsSelection() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id))
    } else {
      setSelectedInterests([...selectedInterests, id])
    }
  }

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      localStorage.setItem('interests', JSON.stringify(selectedInterests))
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    router.push('/onboarding/goals')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 4 of 4</span>
            <span className="text-sm font-medium text-indigo-600">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{width: '100%'}}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h1 className="font-sora text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What Interests You? 💫
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Select topics you'd like to learn about
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <span className="text-sm font-semibold text-indigo-600">
                {selectedInterests.length} selected
              </span>
              {selectedInterests.length > 0 && (
                <span className="text-xs text-gray-500">
                  (Select at least 1)
                </span>
              )}
            </div>
          </div>

          {/* Interests Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 group ${
                  selectedInterests.includes(interest.id)
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${interest.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                    {interest.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {interest.name}
                  </h3>
                </div>

                {/* Checkmark */}
                {selectedInterests.includes(interest.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personalized Learning</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We'll use your interests to curate relevant content, stories, and vocabulary that match what you care about. Learning is more effective when it's engaging!
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              onClick={handleBack}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedInterests.length === 0}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 ${
                selectedInterests.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Start Learning</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🎉 Almost there! You're about to start your language learning journey!
          </p>
        </div>
      </div>
    </div>
  )
}
