import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { targetLanguage, nativeLanguage, userLevel, category } = await req.json()

    const languageNames: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const nativeLangName = languageNames[nativeLanguage] || nativeLanguage

    const categoryDescriptions: { [key: string]: string } = {
      travel: 'travel situations (airport, hotel, asking for directions)',
      restaurant: 'ordering food, making reservations, asking about menu items',
      shopping: 'buying items, asking for prices, returns and exchanges',
      business: 'meetings, presentations, professional conversations',
      health: 'doctor visits, pharmacy, describing symptoms',
      education: 'classroom, asking questions, discussing studies',
      social: 'meeting new people, casual conversations, social events',
      phone: 'phone calls, leaving messages, making appointments',
      general: 'everyday situations'
    }

    const categoryDesc = categoryDescriptions[category] || categoryDescriptions.general

    const prompt = `Generate a speaking practice scenario for a ${userLevel}-level ${targetLangName} learner.

REQUIREMENTS:
1. Create a realistic ${categoryDesc} scenario
2. The scenario situation should be described in ${targetLangName}
3. The speaking prompt (what the user should respond to) should be in ${targetLangName}
4. Difficulty should match ${userLevel} level
5. The scenario should encourage 30-60 seconds of speaking

Level Guidelines:
- Beginner: Simple, direct questions requiring basic responses (2-3 sentences)
- Intermediate: Conversational scenarios requiring explanations (4-6 sentences)
- Advanced: Complex situations requiring detailed responses (6-10 sentences)

Return ONLY valid JSON (no markdown, no backticks):
{
  "scenario": {
    "situation": "Brief description of the situation in ${targetLangName} (1-2 sentences)",
    "prompt": "The speaking prompt/question in ${targetLangName} that the user should respond to",
    "suggestedLength": "Expected response length (e.g., 'Speak for 30-45 seconds')",
    "difficulty": "${userLevel}"
  }
}

Example for Beginner Spanish (restaurant):
{
  "scenario": {
    "situation": "Estás en un restaurante y necesitas ordenar comida.",
    "prompt": "¿Qué te gustaría ordenar? Describe lo que quieres comer y beber.",
    "suggestedLength": "Speak for 30-45 seconds",
    "difficulty": "beginner"
  }
}

Example for Intermediate French (travel):
{
  "scenario": {
    "situation": "Vous êtes à l'aéroport et votre vol a été annulé. Vous devez parler à l'agent.",
    "prompt": "Expliquez votre situation à l'agent et demandez une solution.",
    "suggestedLength": "Speak for 45-60 seconds",
    "difficulty": "intermediate"
  }
}

Generate a ${category} scenario now.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a language learning expert. You always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API request failed: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    let contentText = data.choices[0].message.content

    // Remove markdown code blocks if present
    contentText = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsedData = JSON.parse(contentText)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Error generating scenario:', error)
    
    return NextResponse.json({
      error: 'Failed to generate scenario',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}