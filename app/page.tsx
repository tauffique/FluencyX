'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, BookOpen, Mic, FileEdit, CreditCard, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  useEffect(() => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal')
    
    function checkReveal() {
      reveals.forEach(reveal => {
        const windowHeight = window.innerHeight
        const elementTop = reveal.getBoundingClientRect().top
        const elementVisible = 150
        
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active')
        }
      })
    }
    
    window.addEventListener('scroll', checkReveal)
    checkReveal()

    return () => window.removeEventListener('scroll', checkReveal)
  }, [])

  return (
    <div className="bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <span className="font-sora text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FluencySure</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">How it Works</a>
              <Link href="/onboarding/language">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold btn-primary shadow-lg hover:shadow-xl">
                  Start Free
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden gradient-bg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white slide-up">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                  🚀 Powered by Advanced AI
                </span>
              </div>
              <h1 className="font-sora text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Master Any<br/>
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Language</span><br/>
                With AI
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Transform your language learning journey with AI-powered tools, personalized lessons, and interactive practice. Learn smarter, not harder.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/onboarding/language">
                  <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg btn-primary shadow-2xl hover:shadow-3xl flex items-center space-x-2 group">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="flex items-center space-x-8 mt-10">
                <div className="text-center">
                  <div className="font-sora text-3xl font-bold">500K+</div>
                  <div className="text-white/80 text-sm">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="font-sora text-3xl font-bold">50+</div>
                  <div className="text-white/80 text-sm">Languages</div>
                </div>
                <div className="text-center">
                  <div className="font-sora text-3xl font-bold">4.9★</div>
                  <div className="text-white/80 text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-[600px]">
                {/* Main Card */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 glass rounded-3xl p-6 shadow-2xl animate-float z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">AI Conversation</div>
                      <div className="text-white/70 text-sm">Practice speaking</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 mb-3">
                    <p className="text-white/90 text-sm">¿Cómo estás hoy?</p>
                  </div>
                  <div className="bg-indigo-500/30 rounded-2xl p-4">
                    <p className="text-white/90 text-sm">Estoy muy bien, gracias! ¿Y tú?</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <div className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white/70 text-sm">Type your message...</div>
                    <button className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center animate-pulse-slow">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Floating Vocab Card */}
                <div className="absolute top-10 right-0 w-64 bg-white rounded-2xl p-5 shadow-xl animate-float-delay">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-800 font-semibold">Daily Vocabulary</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">15/20</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Bonjour</span>
                      <span className="text-gray-400 text-xs">- Hello</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Merci</span>
                      <span className="text-gray-400 text-xs">- Thank you</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Bonsoir</span>
                      <span className="text-gray-400 text-xs">- Good evening</span>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute bottom-10 left-0 w-56 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 shadow-xl animate-float">
                  <div className="text-white mb-2 text-sm font-medium">Weekly Progress</div>
                  <div className="text-white font-sora text-3xl font-bold mb-3">87%</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <div className="bg-white rounded-full h-2" style={{width: '87%'}}></div>
                  </div>
                  <div className="text-white/80 text-xs">🔥 7 day streak!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold">
                ✨ Powerful Features
              </span>
            </div>
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to<br/>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Master a New Language</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge AI technology meets intuitive design to create the ultimate language learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="feature-card bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">AI Chatbot</h3>
              <p className="text-gray-600 mb-4">Practice real conversations with our intelligent AI tutor. Get instant feedback and corrections in a natural, supportive environment.</p>
              <a href="#" className="text-indigo-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">Smart Reading Hub</h3>
              <p className="text-gray-600 mb-4">Access curated stories and articles tailored to your level. Build vocabulary and comprehension through engaging content.</p>
              <a href="#" className="text-pink-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Card 3 */}
            <div className="feature-card bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-100">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">Pronunciation Trainer</h3>
              <p className="text-gray-600 mb-4">Perfect your accent with AI-powered speech recognition. Get detailed feedback on pronunciation and intonation.</p>
              <a href="#" className="text-teal-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Card 4 */}
            <div className="feature-card bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FileEdit className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">Writing Assistant</h3>
              <p className="text-gray-600 mb-4">Improve your writing skills with AI-powered corrections and suggestions. Learn grammar naturally through practice.</p>
              <a href="#" className="text-amber-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Card 5 */}
            <div className="feature-card bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">Advanced Flashcards</h3>
              <p className="text-gray-600 mb-4">Master 20 new words daily with spaced repetition. Smart algorithm adapts to your learning pace and retention.</p>
              <a href="#" className="text-violet-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Card 6 */}
            <div className="feature-card bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">Track your progress with detailed insights. Understand your strengths and areas for improvement with data-driven feedback.</p>
              <a href="#" className="text-emerald-600 font-semibold inline-flex items-center space-x-2 group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-sora text-5xl font-bold text-white mb-2">500K+</div>
              <div className="text-white/80 text-lg">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="font-sora text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-lg">Languages Available</div>
            </div>
            <div className="text-center">
              <div className="font-sora text-5xl font-bold text-white mb-2">10M+</div>
              <div className="text-white/80 text-lg">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="font-sora text-5xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/80 text-lg">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold">
                🎯 Simple Process
              </span>
            </div>
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Learning in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-indigo-200">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotating-border">
                  <span className="text-white font-sora text-2xl font-bold">1</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-gray-900 mb-3">Choose Languages</h3>
                <p className="text-gray-600">Select your native language and the language you want to learn from 50+ options.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-indigo-300" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-pink-200">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotating-border">
                  <span className="text-white font-sora text-2xl font-bold">2</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-gray-900 mb-3">Set Your Level</h3>
                <p className="text-gray-600">Take a quick assessment to determine your current proficiency level (A0-C2).</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-pink-300" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-teal-200">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotating-border">
                  <span className="text-white font-sora text-2xl font-bold">3</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-gray-900 mb-3">Choose Goals</h3>
                <p className="text-gray-600">Set your daily learning time and topics of interest for personalized content.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-teal-300" />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-amber-200">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotating-border">
                  <span className="text-white font-sora text-2xl font-bold">4</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-gray-900 mb-3">Start Learning</h3>
                <p className="text-gray-600">Begin your personalized learning journey with AI-powered lessons and practice.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/onboarding/language">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg btn-primary shadow-xl hover:shadow-2xl">
                Start Your Free Trial
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float-delay"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-sora text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Master a New Language?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 500,000+ learners worldwide and start your journey to fluency today. Free trial, no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/onboarding/language">
              <button className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-lg btn-primary shadow-2xl hover:shadow-3xl flex items-center space-x-2 group">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <p className="text-white/70 mt-6 text-sm">
            ✓ No credit card required  •  ✓ 14-day free trial  •  ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                  </svg>
                </div>
                <span className="font-sora text-xl font-bold">FluencySure</span>
              </div>
              <p className="text-gray-400 text-sm">Master any language with AI-powered learning tools.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Languages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 FluencySure. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
