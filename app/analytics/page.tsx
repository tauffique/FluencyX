'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, TrendingUp, Flame, Clock, Target, Brain, Zap,
  Award, Trophy, Star, BookOpen, MessageSquare, FileText,
  ChevronRight, Calendar, Activity, BarChart3
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

interface StudySession {
  id: string
  activity: 'flashcards' | 'reading' | 'writing' | 'chatbot'
  startTime: number
  endTime: number
  duration: number
  wordsLearned: number
  questionsAnswered: number
  correctAnswers: number
  score: number
  date: string
}

interface DailyStats {
  date: string
  totalTime: number
  wordsLearned: number
  averageScore: number
  sessions: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress?: number
  target?: number
}

export default function AnalyticsPage() {
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalWordsLearned, setTotalWordsLearned] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [weeklyGoal, setWeeklyGoal] = useState(300) // 5 hours in minutes
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week')
  
  // Live session timer
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    loadAnalyticsData()
    
    // Timer for live session
    const interval = setInterval(() => {
      if (currentSession) {
        setSessionTime(Math.floor((Date.now() - currentSession.startTime) / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession])

  const loadAnalyticsData = () => {
    // Load from localStorage
    const savedSessions = localStorage.getItem('studySessions')
    if (savedSessions) {
      const parsedSessions: StudySession[] = JSON.parse(savedSessions)
      setSessions(parsedSessions)
      calculateStats(parsedSessions)
    }

    // Load achievements
    loadAchievements()
  }

  const calculateStats = (sessions: StudySession[]) => {
    // Calculate total stats
    const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0)
    const totalWords = sessions.reduce((acc, s) => acc + s.wordsLearned, 0)
    const avgScore = sessions.length > 0 
      ? sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length 
      : 0

    setTotalStudyTime(totalTime)
    setTotalWordsLearned(totalWords)
    setAverageScore(Math.round(avgScore))

    // Calculate daily stats for charts
    const dailyMap = new Map<string, DailyStats>()
    sessions.forEach(session => {
      const existing = dailyMap.get(session.date) || {
        date: session.date,
        totalTime: 0,
        wordsLearned: 0,
        averageScore: 0,
        sessions: 0
      }
      
      existing.totalTime += session.duration
      existing.wordsLearned += session.wordsLearned
      existing.averageScore = ((existing.averageScore * existing.sessions) + session.score) / (existing.sessions + 1)
      existing.sessions += 1
      
      dailyMap.set(session.date, existing)
    })

    const dailyArray = Array.from(dailyMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    setDailyStats(dailyArray)

    // Calculate streak
    calculateStreak(dailyArray)
  }

  const calculateStreak = (daily: DailyStats[]) => {
    if (daily.length === 0) {
      setStreak(0)
      setLongestStreak(0)
      return
    }

    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 1

    const today = new Date().toDateString()
    const sortedDates = daily.map(d => new Date(d.date).toDateString())

    // Check if studied today or yesterday
    const lastStudyDate = new Date(daily[daily.length - 1].date).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastStudyDate === today || lastStudyDate === yesterday) {
      currentStreak = 1
      
      // Count backwards
      for (let i = daily.length - 2; i >= 0; i--) {
        const currentDate = new Date(daily[i].date)
        const nextDate = new Date(daily[i + 1].date)
        const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / 86400000)
        
        if (dayDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < daily.length; i++) {
      const currentDate = new Date(daily[i].date)
      const prevDate = new Date(daily[i - 1].date)
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / 86400000)
      
      if (dayDiff === 1) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    setStreak(currentStreak)
    setLongestStreak(Math.max(maxStreak, currentStreak))
  }

  const loadAchievements = () => {
    const achievementsList: Achievement[] = [
      {
        id: 'first_lesson',
        title: 'First Lesson',
        description: 'Complete your first study session',
        icon: '🎓',
        unlocked: sessions.length > 0,
        unlockedAt: sessions.length > 0 ? sessions[0].startTime : undefined
      },
      {
        id: 'streak_7',
        title: '7-Day Streak',
        description: 'Study for 7 consecutive days',
        icon: '🔥',
        unlocked: streak >= 7,
        progress: streak,
        target: 7
      },
      {
        id: 'words_100',
        title: '100 Words',
        description: 'Learn 100 words',
        icon: '📚',
        unlocked: totalWordsLearned >= 100,
        progress: totalWordsLearned,
        target: 100
      },
      {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Get 100% on any activity',
        icon: '⭐',
        unlocked: sessions.some(s => s.score === 100)
      },
      {
        id: 'hours_10',
        title: '10 Hours',
        description: 'Study for 10 total hours',
        icon: '⏱️',
        unlocked: totalStudyTime >= 600,
        progress: totalStudyTime,
        target: 600
      },
      {
        id: 'streak_30',
        title: '30-Day Streak',
        description: 'Study for 30 consecutive days',
        icon: '🏅',
        unlocked: streak >= 30,
        progress: streak,
        target: 30
      }
    ]

    setAchievements(achievementsList)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayStats = dailyStats.find(d => d.date === date)
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
      return {
        day: dayName,
        minutes: dayStats ? Math.round(dayStats.totalTime) : 0,
        words: dayStats ? dayStats.wordsLearned : 0,
        score: dayStats ? Math.round(dayStats.averageScore) : 0
      }
    })
  }

  const getActivityBreakdown = () => {
    const breakdown = {
      flashcards: 0,
      reading: 0,
      writing: 0,
      chatbot: 0
    }

    sessions.forEach(session => {
      breakdown[session.activity] += session.duration
    })

    return [
      { name: 'Flashcards', value: breakdown.flashcards, color: '#3B82F6' },
      { name: 'Reading', value: breakdown.reading, color: '#10B981' },
      { name: 'Writing', value: breakdown.writing, color: '#F59E0B' },
      { name: 'Chatbot', value: breakdown.chatbot, color: '#8B5CF6' }
    ].filter(item => item.value > 0)
  }

  const getPerformanceTrend = () => {
    return dailyStats.slice(-14).map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(day.averageScore)
    }))
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.date === today)
    
    return {
      time: todaySessions.reduce((acc, s) => acc + s.duration, 0),
      words: todaySessions.reduce((acc, s) => acc + s.wordsLearned, 0),
      sessions: todaySessions.length
    }
  }

  const getWeeklyProgress = () => {
    const last7Days = sessions.filter(s => {
      const sessionDate = new Date(s.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })

    const weeklyTime = last7Days.reduce((acc, s) => acc + s.duration, 0)
    return Math.round((weeklyTime / weeklyGoal) * 100)
  }

  const getSmartInsights = () => {
    const insights = []
    const today = getTodayStats()
    const weeklyProgress = getWeeklyProgress()

    // Streak insights
    if (streak > 0) {
      insights.push({
        icon: '🔥',
        title: `Amazing! ${streak}-day streak!`,
        description: `You're on fire! Keep it going!`
      })
    }

    // Weekly goal insight
    if (weeklyProgress >= 100) {
      insights.push({
        icon: '🎯',
        title: 'Weekly goal achieved!',
        description: 'Fantastic work this week!'
      })
    } else if (weeklyProgress >= 75) {
      insights.push({
        icon: '💪',
        title: 'Almost there!',
        description: `${Math.round(weeklyGoal - (weeklyProgress * weeklyGoal / 100))} mins to hit your weekly goal`
      })
    }

    // Performance insight
    if (averageScore >= 90) {
      insights.push({
        icon: '⭐',
        title: 'Excellent performance!',
        description: `Your average score is ${averageScore}%`
      })
    }

    // Words learned
    if (totalWordsLearned > 0) {
      insights.push({
        icon: '📚',
        title: `${totalWordsLearned} words learned`,
        description: 'Your vocabulary is growing!'
      })
    }

    return insights.slice(0, 4)
  }

  const weeklyData = getWeeklyData()
  const activityBreakdown = getActivityBreakdown()
  const performanceTrend = getPerformanceTrend()
  const todayStats = getTodayStats()
  const weeklyProgress = getWeeklyProgress()
  const insights = getSmartInsights()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="font-sora text-xl font-bold text-gray-900">Analytics</h1>
            </div>

            {/* Time Range Toggle */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {['week', 'month', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Stats - Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">{streak}</span>
            </div>
            <h3 className="text-lg font-semibold">Day Streak</h3>
            <p className="text-white/80 text-sm">Best: {longestStreak} days</p>
          </div>

          {/* Today's Time */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" />
              <span className="text-3xl font-bold">{todayStats.time}</span>
            </div>
            <h3 className="text-lg font-semibold">Minutes Today</h3>
            <p className="text-white/80 text-sm">{todayStats.sessions} sessions</p>
          </div>

          {/* Words Learned */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8" />
              <span className="text-3xl font-bold">{totalWordsLearned}</span>
            </div>
            <h3 className="text-lg font-semibold">Words Learned</h3>
            <p className="text-white/80 text-sm">{todayStats.words} today</p>
          </div>

          {/* Average Score */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8" />
              <span className="text-3xl font-bold">{averageScore}%</span>
            </div>
            <h3 className="text-lg font-semibold">Avg Score</h3>
            <p className="text-white/80 text-sm">Keep it up!</p>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Weekly Goal</h2>
              <p className="text-gray-600">Study {formatTime(weeklyGoal)} per week</p>
            </div>
            <span className="text-3xl font-bold text-indigo-600">{weeklyProgress}%</span>
          </div>
          
          <div className="relative">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              ></div>
            </div>
            {weeklyProgress >= 100 && (
              <div className="absolute -top-1 right-0 animate-bounce">
                🎉
              </div>
            )}
          </div>

          {weeklyProgress < 100 && (
            <p className="text-sm text-gray-600 mt-2">
              {formatTime(Math.round(weeklyGoal - (weeklyProgress * weeklyGoal / 100)))} remaining to hit your goal!
            </p>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Study Pattern */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
              Weekly Study Pattern
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value} min`, 'Study Time']}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Total: {formatTime(weeklyData.reduce((acc, d) => acc + d.minutes, 0))}
            </p>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-indigo-600" />
              Activity Breakdown
            </h2>
            {activityBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={activityBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => {
                        const { name, percent } = props;
                        return `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatTime(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {activityBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700">{item.name}: {formatTime(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No activity data yet. Start studying to see your breakdown!</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Trend */}
        {performanceTrend.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
              Performance Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, 'Score']}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Smart Insights & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Smart Insights */}
          {insights.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                Smart Insights
              </h2>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-3xl">{insight.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-indigo-600" />
              Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    achievement.unlocked 
                      ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm text-gray-900 text-center mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-gray-600 text-center">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.target!) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {achievement.progress} / {achievement.target}
                      </p>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="flex justify-center mt-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Unlocked!
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {sessions.slice(-10).reverse().map((session) => {
                const activityIcons = {
                  flashcards: '📇',
                  reading: '📖',
                  writing: '✍️',
                  chatbot: '💬'
                }
                const timeAgo = Math.floor((Date.now() - session.endTime) / 60000)
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{activityIcons[session.activity]}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{session.activity}</h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(session.duration)} • {session.wordsLearned} words • {session.score}% score
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Learning Journey!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Complete your first study session to see your analytics come to life with charts, insights, and achievements!
            </p>
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Start Learning
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}