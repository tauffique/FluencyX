import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const languageCodeMap: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish (Español)',
  'fr': 'French (Français)',
  'de': 'German (Deutsch)',
  'it': 'Italian (Italiano)',
  'pt': 'Portuguese (Português)',
  'ja': 'Japanese (日本語)',
  'ko': 'Korean (한국어)',
  'zh': 'Chinese (中文)',
  'ar': 'Arabic (العربية)',
  'ru': 'Russian (Русский)',
  'hi': 'Hindi (हिन्दी)',
  'tr': 'Turkish (Türkçe)',
  'nl': 'Dutch (Nederlands)',
  'pl': 'Polish (Polski)',
  'sv': 'Swedish (Svenska)',
  'no': 'Norwegian (Norsk)',
  'da': 'Danish (Dansk)',
  'fi': 'Finnish (Suomi)',
  'el': 'Greek (Ελληνικά)',
  'he': 'Hebrew (עברית)',
  'th': 'Thai (ไทย)',
  'vi': 'Vietnamese (Tiếng Việt)',
  'id': 'Indonesian (Bahasa Indonesia)',
}

const levelGuidelines: Record<string, string> = {
  'A0': 'absolute beginner level with very simple vocabulary (100-200 unique words), present tense only, short sentences (5-8 words)',
  'A1': 'beginner level with simple vocabulary (200-400 words), present and past tense, simple sentences (8-12 words)',
  'A2': 'elementary level with everyday vocabulary (400-800 words), basic tenses, moderate sentences (10-15 words)',
  'B1': 'intermediate level with diverse vocabulary (800-1500 words), multiple tenses, varied sentence structure',
  'B2': 'upper intermediate level with advanced vocabulary (1500-3000 words), complex structures, idiomatic expressions',
  'C1': 'advanced level with sophisticated vocabulary (3000+ words), complex grammar, nuanced expressions',
  'C2': 'proficient level with native-like vocabulary, literary devices, complex discourse'
}

export async function POST(request: Request) {
  try {
    const { targetLanguage, proficiencyLevel, count, excludeTitles } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const languageFullName = languageCodeMap[targetLanguage] || targetLanguage
    const levelGuide = levelGuidelines[proficiencyLevel] || levelGuidelines['A1']
    const wordCount = proficiencyLevel === 'A0' ? '100-150' :
                     proficiencyLevel === 'A1' ? '150-250' :
                     proficiencyLevel === 'A2' ? '200-300' :
                     proficiencyLevel === 'B1' ? '250-400' :
                     proficiencyLevel === 'B2' ? '300-500' :
                     proficiencyLevel === 'C1' ? '400-600' : '500-800'

    const excludeInstruction = excludeTitles && excludeTitles.length > 0
      ? `\n\nIMPORTANT: Do NOT create stories with these titles or similar themes: ${excludeTitles.join(', ')}. Create completely different and unique stories.`
      : ''

    const systemPrompt = `You are a creative story generator for language learners. Generate ${count} unique and engaging short stories ENTIRELY in ${languageFullName} (NOT in English - write EVERY SINGLE WORD in ${languageFullName}) at ${levelGuide}.

CRITICAL INSTRUCTION: Every single word of the story MUST be written in ${languageFullName}. Do NOT write in English. Write ONLY in ${languageFullName}. The title, preview, and content must ALL be in ${languageFullName}.

Requirements for EACH story:
1. Word count: ${wordCount} words
2. Appropriate for ${proficiencyLevel} level learners
3. Engaging and interesting plot
4. Cultural relevance to ${languageFullName} speakers
5. Clear narrative structure (beginning, middle, end)
6. Age-appropriate content (suitable for all ages)
7. MUST be completely unique and different from each other
8. WRITTEN ENTIRELY IN ${languageFullName} - NO ENGLISH WORDS AT ALL${excludeInstruction}

Return ONLY a valid JSON array with this exact structure (but with all story content in ${languageFullName}):
[
  {
    "title": "Story Title in ${languageFullName}",
    "preview": "First 2-3 sentences in ${languageFullName}",
    "content": "Full story in ${languageFullName} with paragraphs separated by \\n\\n",
    "wordCount": actual_word_count_as_number
  }
]

IMPORTANT: Write EVERYTHING (title, preview, content) in ${languageFullName}, NOT in English!

Make sure each story is COMPLETELY DIFFERENT in:
- Theme (adventure, daily life, mystery, humor, fantasy, history, etc.)
- Characters (different names appropriate for ${languageFullName} culture)
- Setting (places relevant to ${languageFullName} speaking regions)
- Plot (unique events and outcomes)

Stories should be interesting and keep learners engaged!`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Faster than GPT-4
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${count} unique stories now. Remember: Write EVERYTHING in ${languageFullName}, NOT in English!` }
      ],
      temperature: 0.9, // High temperature for creativity
      max_tokens: 2000, // Reduced for faster response
    })

    const responseText = completion.choices[0].message.content || '[]'
    
    // Parse the JSON response
    let stories
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      stories = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Failed to parse story data')
    }

    return NextResponse.json({ stories })
  } catch (error: any) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate stories' },
      { status: 500 }
    )
  }
}