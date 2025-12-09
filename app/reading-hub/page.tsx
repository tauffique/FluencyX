'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, RefreshCw, Loader2, Sparkles } from 'lucide-react'

interface Story {
  id: string
  title: string
  preview: string
  content: string
  level: string
  wordCount: number
  timestamp: number
}

export default function ReadingHubPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [proficiencyLevel, setProficiencyLevel] = useState('')

  useEffect(() => {
    // Get user data from localStorage
    const target = localStorage.getItem('targetLanguage')
    const level = localStorage.getItem('proficiencyLevel')
    
    if (target) setTargetLanguage(target)
    if (level) setProficiencyLevel(level)

    // Load saved stories from localStorage
    const savedStories = localStorage.getItem('readingHubStories')
    const savedLanguage = localStorage.getItem('readingHubLanguage')
    
    // Check if language has changed - if so, clear old stories
    if (savedLanguage && savedLanguage !== target) {
      // Language changed - clear stories and generate new ones
      localStorage.removeItem('readingHubStories')
      localStorage.setItem('readingHubLanguage', target || '')
      generateStories()
    } else if (savedStories) {
      // Same language - load existing stories
      setStories(JSON.parse(savedStories))
      localStorage.setItem('readingHubLanguage', target || '')
    } else {
      // First time - generate initial stories
      localStorage.setItem('readingHubLanguage', target || '')
      generateStories()
    }
  }, [])

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian'
    }
    return names[code] || code.toUpperCase()
  }

  const generateStories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
          proficiencyLevel,
          count: 5
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate stories')
      }

      const data = await response.json()
      const newStories: Story[] = data.stories.map((story: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: story.title,
        preview: story.preview,
        content: story.content,
        level: proficiencyLevel,
        wordCount: story.wordCount,
        timestamp: Date.now()
      }))

      setStories(newStories)
      
      // Save to localStorage
      localStorage.setItem('readingHubStories', JSON.stringify(newStories))
    } catch (error) {
      console.error('Error generating stories:', error)
      alert('Failed to generate stories. Please check your API configuration.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateMoreStories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
          proficiencyLevel,
          count: 5,
          excludeTitles: stories.map(s => s.title) // Avoid duplicates
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate stories')
      }

      const data = await response.json()
      const newStories: Story[] = data.stories.map((story: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: story.title,
        preview: story.preview,
        content: story.content,
        level: proficiencyLevel,
        wordCount: story.wordCount,
        timestamp: Date.now()
      }))

      const updatedStories = [...stories, ...newStories]
      setStories(updatedStories)
      
      // Save to localStorage
      localStorage.setItem('readingHubStories', JSON.stringify(updatedStories))
    } catch (error) {
      console.error('Error generating stories:', error)
      alert('Failed to generate more stories. Please check your API configuration.')
    } finally {
      setIsLoading(false)
    }
  }

  const openStory = (storyId: string) => {
    router.push(`/reading-hub/${storyId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
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
              <h1 className="font-sora text-lg font-bold text-gray-900">Reading Hub</h1>
              <p className="text-xs text-gray-500">
                {getLanguageName(targetLanguage)} • {proficiencyLevel}
              </p>
            </div>
            <button
              onClick={generateStories}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <div>
              <h2 className="font-sora text-3xl font-bold">Welcome to Reading Hub!</h2>
              <p className="text-white/90">Improve your reading skills with AI-generated stories</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Stories Available</div>
              <div className="font-bold text-2xl">{stories.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Your Level</div>
              <div className="font-bold text-2xl">{proficiencyLevel}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="text-white/80 text-sm">Language</div>
              <div className="font-bold text-2xl">{getLanguageName(targetLanguage)}</div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {isLoading && stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-4" />
              <Sparkles className="w-8 h-8 text-pink-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <p className="text-gray-900 text-xl font-bold mb-2">Generating Your Stories...</p>
            <p className="text-gray-600 text-base mb-4">AI is creating personalized content for you</p>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">This usually takes 10-15 seconds</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => openStory(story.id)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-left border-2 border-transparent hover:border-purple-200 group"
                >
                  {/* Story Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  {/* Story Title */}
                  <h3 className="font-sora text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Story Preview */}
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {story.preview}
                  </p>

                  {/* Story Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{story.level}</span>
                    </span>
                    <span>{story.wordCount} words</span>
                  </div>

                  {/* Read Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-purple-600 font-semibold text-sm group-hover:text-purple-700">
                      Read Story →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Generate More Button */}
            <div className="flex justify-center">
              <button
                onClick={generateMoreStories}
                disabled={isLoading}
                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-2 transition-all ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate More Stories</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Help Text */}
        {stories.length > 0 && (
          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">How to Use Reading Hub</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>📖 Click any story to read the full text</li>
                  <li>🔊 Use the voice button to listen to the story</li>
                  <li>💡 Click any word to see its translation</li>
                  <li>📝 Take a quiz after reading to test comprehension</li>
                  <li>✨ Generate more stories anytime for fresh content</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}