import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, nativeLanguage, proficiencyLevel, feedbackLanguage } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const languageNames: Record<string, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const feedbackLangName = languageNames[feedbackLanguage] || feedbackLanguage

    const systemPrompt = `You are an expert ${targetLangName} language teacher evaluating student writing.

Student Level: ${proficiencyLevel}
Target Language: ${targetLangName}
Feedback Language: ${feedbackLangName}

Evaluate the student's writing on these criteria:
1. Grammar (0-100)
2. Vocabulary (0-100)
3. Sentence Structure (0-100)
4. Coherence & Flow (0-100)

IMPORTANT: 
- Provide ALL feedback in ${feedbackLangName}
- Be encouraging and constructive
- Adjust expectations based on ${proficiencyLevel} level
- For beginners (A0-A2), be more lenient and focus on basics
- For advanced (B2-C2), be more critical and expect sophistication

Return ONLY valid JSON with this exact structure:
{
  "overallScore": number (0-100, average of all criteria),
  "grammar": {
    "score": number (0-100),
    "issues": ["issue 1 in ${feedbackLangName}", "issue 2 in ${feedbackLangName}"],
    "corrections": ["correction 1 in ${feedbackLangName}", "correction 2 in ${feedbackLangName}"]
  },
  "vocabulary": {
    "score": number (0-100),
    "strengths": ["strength 1 in ${feedbackLangName}", "strength 2 in ${feedbackLangName}"],
    "improvements": ["improvement 1 in ${feedbackLangName}", "improvement 2 in ${feedbackLangName}"]
  },
  "sentenceStructure": {
    "score": number (0-100),
    "analysis": ["point 1 in ${feedbackLangName}", "point 2 in ${feedbackLangName}"]
  },
  "coherence": {
    "score": number (0-100),
    "feedback": "detailed feedback in ${feedbackLangName}"
  },
  "tips": [
    "practical tip 1 in ${feedbackLangName}",
    "practical tip 2 in ${feedbackLangName}",
    "practical tip 3 in ${feedbackLangName}"
  ],
  "correctedText": "the corrected version of their text in ${targetLangName} (fix all errors but keep their style)",
  "detailedFeedback": "comprehensive paragraph of feedback in ${feedbackLangName} (2-3 sentences, encouraging tone)"
}

Scoring Guidelines:
- A0-A1: 40-60 baseline, reward basic attempts
- A2-B1: 50-75 baseline, expect correct basics
- B2: 60-85 baseline, expect good grammar
- C1-C2: 70-95 baseline, expect near-native quality

Be encouraging! Focus on what they did well AND how to improve.`

    const userPrompt = `Evaluate this ${targetLangName} writing:

"${text}"

Remember: Student is at ${proficiencyLevel} level. Provide ALL feedback in ${feedbackLangName}.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0].message.content || '{}'
    
    // Parse the JSON response
    let evaluation
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      evaluation = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Failed to parse evaluation data')
    }

    return NextResponse.json({ evaluation })
  } catch (error: any) {
    console.error('Writing evaluation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate writing' },
      { status: 500 }
    )
  }
}