// Analytics Tracking Utility
// Use this to track study sessions from any activity

export interface StudySession {
    id: string
    activity: 'flashcards' | 'reading' | 'writing' | 'chatbot'
    startTime: number
    endTime: number
    duration: number // in minutes
    wordsLearned: number
    questionsAnswered: number
    correctAnswers: number
    score: number // percentage 0-100
    date: string // YYYY-MM-DD format
  }
  
  /**
   * Start a new study session
   * Call this when user starts any learning activity
   */
  export const startStudySession = (activity: StudySession['activity']): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = {
      id: sessionId,
      activity,
      startTime: Date.now(),
      active: true
    }
    
    // Store active session
    localStorage.setItem('activeSession', JSON.stringify(session))
    
    return sessionId
  }
  
  /**
   * End a study session and save to analytics
   * Call this when user completes or exits an activity
   */
  export const endStudySession = (
    sessionId: string,
    data: {
      wordsLearned: number
      questionsAnswered: number
      correctAnswers: number
    }
  ): void => {
    const activeSession = localStorage.getItem('activeSession')
    if (!activeSession) return
    
    const session = JSON.parse(activeSession)
    if (session.id !== sessionId) return
    
    const endTime = Date.now()
    const duration = Math.round((endTime - session.startTime) / 60000) // convert to minutes
    const score = data.questionsAnswered > 0 
      ? Math.round((data.correctAnswers / data.questionsAnswered) * 100) 
      : 0
    
    const completedSession: StudySession = {
      id: session.id,
      activity: session.activity,
      startTime: session.startTime,
      endTime,
      duration: Math.max(duration, 1), // minimum 1 minute
      wordsLearned: data.wordsLearned,
      questionsAnswered: data.questionsAnswered,
      correctAnswers: data.correctAnswers,
      score,
      date: new Date().toISOString().split('T')[0]
    }
    
    // Save to sessions history
    const savedSessions = localStorage.getItem('studySessions')
    const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : []
    sessions.push(completedSession)
    localStorage.setItem('studySessions', JSON.stringify(sessions))
    
    // Clear active session
    localStorage.removeItem('activeSession')
    
    console.log('Study session saved:', completedSession)
  }
  
  /**
   * Quick save for simple activities
   * Use this for activities where you want to record data immediately
   */
  export const saveQuickSession = (
    activity: StudySession['activity'],
    data: {
      duration: number // in minutes
      wordsLearned: number
      questionsAnswered: number
      correctAnswers: number
    }
  ): void => {
    const now = Date.now()
    const score = data.questionsAnswered > 0 
      ? Math.round((data.correctAnswers / data.questionsAnswered) * 100) 
      : 0
    
    const session: StudySession = {
      id: `session_${now}_${Math.random().toString(36).substr(2, 9)}`,
      activity,
      startTime: now - (data.duration * 60000),
      endTime: now,
      duration: data.duration,
      wordsLearned: data.wordsLearned,
      questionsAnswered: data.questionsAnswered,
      correctAnswers: data.correctAnswers,
      score,
      date: new Date().toISOString().split('T')[0]
    }
    
    const savedSessions = localStorage.getItem('studySessions')
    const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : []
    sessions.push(session)
    localStorage.setItem('studySessions', JSON.stringify(sessions))
    
    console.log('Quick session saved:', session)
  }
  
  /**
   * Get all study sessions
   */
  export const getAllSessions = (): StudySession[] => {
    const savedSessions = localStorage.getItem('studySessions')
    return savedSessions ? JSON.parse(savedSessions) : []
  }
  
  /**
   * Get today's sessions
   */
  export const getTodaySessions = (): StudySession[] => {
    const today = new Date().toISOString().split('T')[0]
    return getAllSessions().filter(s => s.date === today)
  }
  
  /**
   * Get current streak
   */
  export const getCurrentStreak = (): number => {
    const sessions = getAllSessions()
    if (sessions.length === 0) return 0
    
    // Get unique dates
    const dates = [...new Set(sessions.map(s => s.date))].sort()
    
    const today = new Date().toDateString()
    const lastStudyDate = new Date(dates[dates.length - 1]).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastStudyDate !== today && lastStudyDate !== yesterday) {
      return 0 // Streak broken
    }
    
    let streak = 1
    for (let i = dates.length - 2; i >= 0; i--) {
      const currentDate = new Date(dates[i])
      const nextDate = new Date(dates[i + 1])
      const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / 86400000)
      
      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
  
  /**
   * Get total study time (in minutes)
   */
  export const getTotalStudyTime = (): number => {
    return getAllSessions().reduce((acc, s) => acc + s.duration, 0)
  }
  
  /**
   * Get total words learned
   */
  export const getTotalWordsLearned = (): number => {
    return getAllSessions().reduce((acc, s) => acc + s.wordsLearned, 0)
  }
  
  /**
   * Get average score
   */
  export const getAverageScore = (): number => {
    const sessions = getAllSessions()
    if (sessions.length === 0) return 0
    return Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)
  }
  
  // Export functions for easy use
  export const analyticsTracker = {
    startSession: startStudySession,
    endSession: endStudySession,
    saveQuickSession,
    getAllSessions,
    getTodaySessions,
    getCurrentStreak,
    getTotalStudyTime,
    getTotalWordsLearned,
    getAverageScore
  }
  
  export default analyticsTracker