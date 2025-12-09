import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { storyContent, storyTitle } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are an expert language teacher creating comprehension quiz questions.

Based on the story provided, create exactly 5-6 multiple choice questions that test reading comprehension.

Requirements:
1. Questions should test understanding of:
   - Main ideas and themes
   - Character actions and motivations
   - Plot events and sequence
   - Details and specific information
   - Inferences and implications
2. Each question should have 4 options (A, B, C, D)
3. Only ONE correct answer per question
4. Wrong answers should be plausible but clearly incorrect
5. Questions should be in the SAME language as the story
6. Vary difficulty (2 easy, 2 medium, 2 hard)

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "difficulty": "easy"
    }
  ]
}

Make sure the JSON is valid and properly formatted.`

    const userPrompt = `Story Title: ${storyTitle}

Story Content:
${storyContent}

Generate 5-6 comprehension questions now.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Faster and cheaper
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500, // Reduced for faster response
    })

    const responseText = completion.choices[0].message.content || '{}'
    
    // Parse the JSON response
    let quiz
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      quiz = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Failed to parse quiz data')
    }

    return NextResponse.json({ quiz })
  } catch (error: any) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}