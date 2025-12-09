import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { quiz, answers } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Calculate score and prepare detailed results
    const details: any[] = []
    let correctCount = 0

    quiz.questions.forEach((question: any, index: number) => {
      const userAnswer = answers[index]
      const isCorrect = userAnswer === question.correctAnswer
      
      if (isCorrect) correctCount++

      details.push({
        correct: isCorrect,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        question: question.question
      })
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)

    // Get AI feedback
    const systemPrompt = `You are an encouraging language teacher providing feedback on quiz performance.

Based on the score, provide:
1. Encouraging feedback (2-3 sentences)
2. Specific advice for improvement
3. Praise for strengths

Be positive and motivating, even for low scores.`

    const userPrompt = `The student scored ${score}% (${correctCount} out of ${quiz.questions.length} correct).

Provide encouraging feedback.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const aiFeedback = completion.choices[0].message.content

    // Generate overall feedback based on score
    let feedback = aiFeedback || 'Great effort! Keep practicing to improve your reading comprehension.'

    if (score === 100) {
      feedback = aiFeedback || '🎉 Perfect score! You have excellent reading comprehension!'
    } else if (score >= 80) {
      feedback = aiFeedback || '👏 Great job! You understood the story very well!'
    } else if (score >= 60) {
      feedback = aiFeedback || '👍 Good effort! Keep reading to improve your comprehension.'
    } else if (score >= 40) {
      feedback = aiFeedback || '💪 Keep practicing! Try reading the story again for better understanding.'
    } else {
      feedback = aiFeedback || '📚 Don\'t give up! Reading more stories will help you improve.'
    }

    const evaluation = {
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      feedback,
      details
    }

    return NextResponse.json({ evaluation })
  } catch (error: any) {
    console.error('Quiz evaluation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate quiz' },
      { status: 500 }
    )
  }
}