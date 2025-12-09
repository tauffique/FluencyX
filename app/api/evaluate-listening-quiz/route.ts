import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { questions, answers, story, targetLanguage, nativeLanguage } = await req.json()

    // Calculate score
    let correctCount = 0
    questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)

    const languageNames: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage

    // Generate AI feedback
    const prompt = `A student just completed a ${targetLangName} listening comprehension exercise.

Score: ${score}% (${correctCount} out of ${questions.length} correct)

Provide encouraging feedback in 2-3 sentences:
- If score >= 80%: Excellent performance, praise their listening skills
- If score 60-79%: Good job, encourage continued practice
- If score < 60%: Supportive message, suggest listening more carefully and practicing regularly

Keep it positive, encouraging, and constructive. Return ONLY the feedback text, nothing else.`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an encouraging language teacher providing feedback.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      })

      let feedback = 'Great effort! Keep practicing your listening skills.'
      
      if (response.ok) {
        const data = await response.json()
        feedback = data.choices[0].message.content.trim()
      }

      return NextResponse.json({
        score,
        correctCount,
        totalQuestions: questions.length,
        feedback
      })
    } catch (error) {
      console.error('Error generating feedback:', error)
      
      // Fallback feedback based on score
      let feedback = ''
      if (score >= 80) {
        feedback = 'Excellent work! Your listening comprehension skills are outstanding. Keep up the great work!'
      } else if (score >= 60) {
        feedback = 'Good job! You understood most of the story. With more practice, you\'ll continue to improve!'
      } else {
        feedback = 'Keep practicing! Try listening more carefully and focusing on key words. You\'re making progress!'
      }

      return NextResponse.json({
        score,
        correctCount,
        totalQuestions: questions.length,
        feedback
      })
    }
  } catch (error) {
    console.error('Error evaluating quiz:', error)
    
    return NextResponse.json({
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      feedback: 'Error evaluating quiz. Please try again.'
    })
  }
}