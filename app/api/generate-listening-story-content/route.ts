import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, category, targetLanguage, nativeLanguage } = await req.json()

    const languageNames: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const nativeLangName = languageNames[nativeLanguage] || nativeLanguage

    const wordCount = difficulty === 'beginner' ? '100-150' : difficulty === 'intermediate' ? '200-300' : '300-400'

    const prompt = `Create a listening comprehension exercise in ${targetLangName} for ${difficulty} level learners.

Story Details:
- Title theme: ${title}
- Category: ${category}
- Word count: ${wordCount} words
- Should be interesting and engaging for listening practice

Create a complete story in ${targetLangName}, then create 6 comprehension questions:
- Questions must be in ${nativeLangName} (user's native language)
- Test understanding of main ideas, details, and inferences
- Each question has 4 options
- Mix of easy, medium, and hard questions

Return ONLY valid JSON (no markdown, no explanations, no backticks):
{
  "content": "The complete story text in ${targetLangName}",
  "questions": [
    {
      "question": "Question text in ${nativeLangName}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

CRITICAL:
- Story content MUST be in ${targetLangName}
- Questions MUST be in ${nativeLangName}
- Provide exactly 6 questions
- correctAnswer is the index (0-3) of the correct option`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that creates language learning content. Always return valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    let contentText = data.choices[0].message.content
    
    // Remove markdown code blocks if present
    contentText = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const storyData = JSON.parse(contentText)

    return NextResponse.json(storyData)
  } catch (error) {
    console.error('Error generating story content:', error)
    
    return NextResponse.json({
      content: 'Error generating story. Please try again.',
      questions: [
        {
          question: 'Sample question?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0
        }
      ]
    })
  }
}