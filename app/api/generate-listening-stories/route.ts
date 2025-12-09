import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { targetLanguage, nativeLanguage, userLevel, count } = await req.json()

    const languageNames: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage

    const prompt = `Generate ${count} listening comprehension story titles for ${userLevel} level ${targetLangName} learners.

Each story should be:
- ${userLevel === 'beginner' ? '1-2 minutes (100-150 words)' : userLevel === 'intermediate' ? '2-3 minutes (200-300 words)' : '3-4 minutes (300-400 words)'}
- Interesting and engaging topics
- Appropriate for listening comprehension practice
- Similar to IELTS/DAF listening test format

Return ONLY valid JSON (no markdown, no explanations, no backticks):
{
  "stories": [
    {
      "title": "Story title in ${targetLangName}",
      "difficulty": "${userLevel}",
      "duration": "2 min",
      "category": "daily life"
    }
  ]
}

Generate exactly ${count} diverse stories with different categories like: daily life, travel, education, work, culture, shopping, health, family.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates JSON data for language learning. Always return valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500
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

    const storiesData = JSON.parse(contentText)

    return NextResponse.json(storiesData)
  } catch (error) {
    console.error('Error generating stories:', error)
    
    // Return fallback stories
    return NextResponse.json({
      stories: [
        {
          title: 'Error generating stories',
          difficulty: 'beginner',
          duration: '2 min',
          category: 'general'
        }
      ]
    })
  }
}