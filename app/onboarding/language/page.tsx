'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Globe, Check, Sparkles } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
]

export default function LanguageSelectionPage() {
  const router = useRouter()
  const [nativeLanguage, setNativeLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [searchTarget, setSearchTarget] = useState('')

  const filteredTargetLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTarget.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTarget.toLowerCase())
  )

  const nativeLang = LANGUAGES.find(l => l.code === nativeLanguage)
  const targetLang = LANGUAGES.find(l => l.code === targetLanguage)

  const handleContinue = () => {
    if (targetLanguage && nativeLanguage) {
      localStorage.setItem('nativeLanguage', nativeLanguage)
      localStorage.setItem('targetLanguage', targetLanguage)
      router.push('/onboarding/level')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-200 animate-float">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-sora text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Languages</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the language you speak and the one you want to master
            </p>
          </div>

          {/* Language Selection Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Native Language Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-indigo-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-sora text-2xl font-bold text-gray-900">I Speak</h2>
                  <p className="text-gray-500 text-sm">Your native language</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setNativeLanguage(language.code)}
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      nativeLanguage === language.code
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-2 transition-transform duration-300 ${
                        nativeLanguage === language.code ? 'scale-110' : ''
                      }`}>
                        {language.flag}
                      </div>
                      <div className={`font-semibold text-sm ${
                        nativeLanguage === language.code ? 'text-white' : 'text-gray-700'
                      }`}>
                        {language.name}
                      </div>
                    </div>
                    {nativeLanguage === language.code && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Language Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 border border-purple-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-sora text-2xl font-bold text-gray-900">I Want to Learn</h2>
                  <p className="text-gray-500 text-sm">Your target language</p>
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
                />
                <Globe className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                {filteredTargetLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setTargetLanguage(language.code)}
                    disabled={language.code === nativeLanguage}
                    className={`p-4 rounded-2xl transition-all duration-300 relative ${
                      language.code === nativeLanguage
                        ? 'bg-gray-100 opacity-40 cursor-not-allowed'
                        : targetLanguage === language.code
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-200 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-2 transition-transform duration-300 ${
                        targetLanguage === language.code ? 'scale-110' : ''
                      }`}>
                        {language.flag}
                      </div>
                      <div className={`font-semibold text-sm ${
                        targetLanguage === language.code ? 'text-white' : 'text-gray-700'
                      }`}>
                        {language.name}
                      </div>
                    </div>
                    {targetLanguage === language.code && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Languages Display */}
          {nativeLang && targetLang && targetLanguage !== nativeLanguage && (
            <div className="mb-8 animate-slideUp">
              <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-indigo-100/50">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <div className="text-center">
                    <div className="text-6xl mb-3">{nativeLang.flag}</div>
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <div className="font-bold text-white text-lg">{nativeLang.name}</div>
                      <div className="text-white/80 text-sm">{nativeLang.nativeName}</div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl animate-pulse">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-6xl mb-3">{targetLang.flag}</div>
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                      <div className="font-bold text-white text-lg">{targetLang.name}</div>
                      <div className="text-white/80 text-sm">{targetLang.nativeName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!targetLanguage || targetLanguage === nativeLanguage}
              className={`group px-12 py-5 rounded-2xl font-bold text-xl flex items-center space-x-3 transition-all duration-300 ${
                targetLanguage && targetLanguage !== nativeLanguage
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-purple-200 hover:shadow-2xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Next Step</span>
              <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${
                targetLanguage && targetLanguage !== nativeLanguage ? 'group-hover:translate-x-1' : ''
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
            transform: translateY(30px);
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
          animation: slideUp 0.6s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}