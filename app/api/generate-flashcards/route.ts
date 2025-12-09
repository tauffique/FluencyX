import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { targetLanguage, nativeLanguage, proficiencyLevel, count, mode, includeExamples } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Generate appropriate prompt based on mode
    let systemPrompt = ''
    
    if (mode === 'words' && includeExamples) {
      // Words with dual-language examples
      systemPrompt = `You are a vocabulary flashcard generator for language learners.

Generate ${count} vocabulary flashcards for someone learning ${targetLanguage} who speaks ${nativeLanguage} at ${proficiencyLevel} level.

IMPORTANT RULES:
1. Each flashcard has:
   - A single word or 2-word phrase in ${targetLanguage}
   - Translation in ${nativeLanguage}
   - Example sentence in ${targetLanguage} (8-12 words)
   - Same example translated to ${nativeLanguage}

2. Examples should be natural and use the word contextually
3. Match difficulty to ${proficiencyLevel} level
4. Focus on high-frequency, useful vocabulary

Return ONLY valid JSON in this EXACT format:
{
  "flashcards": [
    {
      "word": "word in ${targetLanguage}",
      "meaning": "word in ${nativeLanguage}",
      "example": "Example sentence in ${targetLanguage}",
      "exampleTranslation": "Example sentence in ${nativeLanguage}",
      "level": "${proficiencyLevel}"
    }
  ]
}

Example:
{
  "word": "escuela",
  "meaning": "school",
  "example": "Mañana tengo un examen en la escuela.",
  "exampleTranslation": "Tomorrow I have an exam at school.",
  "level": "A1"
}`
    } else if (mode === 'sentences') {
      // Sentences - no examples
      systemPrompt = `You are a sentence flashcard generator for language learners.

Generate ${count} sentence flashcards for someone learning ${targetLanguage} who speaks ${nativeLanguage} at ${proficiencyLevel} level.

IMPORTANT RULES:
1. Generate complete, natural sentences (5-10 words)
2. NOT single words - full sentences only
3. Match difficulty to ${proficiencyLevel} level
4. Practical, everyday sentences

Return ONLY valid JSON in this EXACT format:
{
  "flashcards": [
    {
      "word": "sentence in ${targetLanguage}",
      "meaning": "sentence in ${nativeLanguage}",
      "level": "${proficiencyLevel}"
    }
  ]
}`
    } else if (mode === 'paragraphs') {
      // Paragraphs - no examples
      systemPrompt = `You are a paragraph flashcard generator for language learners.

Generate ${count} paragraph flashcards for someone learning ${targetLanguage} who speaks ${nativeLanguage} at ${proficiencyLevel} level.

IMPORTANT RULES:
1. Generate short paragraphs (3-4 sentences each)
2. Tell a mini-story or describe something
3. Match difficulty to ${proficiencyLevel} level
4. Natural, conversational language

Return ONLY valid JSON in this EXACT format:
{
  "flashcards": [
    {
      "word": "paragraph in ${targetLanguage}",
      "meaning": "paragraph in ${nativeLanguage}",
      "level": "${proficiencyLevel}"
    }
  ]
}`
    } else {
      // Words without examples (default)
      systemPrompt = `You are a vocabulary flashcard generator for language learners.

Generate ${count} vocabulary flashcards for someone learning ${targetLanguage} who speaks ${nativeLanguage} at ${proficiencyLevel} level.

IMPORTANT RULES:
1. ONLY single words or 2-word phrases
2. Focus on high-frequency vocabulary
3. Match difficulty to ${proficiencyLevel} level
4. Just word + translation (no examples)

Return ONLY valid JSON in this EXACT format:
{
  "flashcards": [
    {
      "word": "word in ${targetLanguage}",
      "meaning": "word in ${nativeLanguage}",
      "level": "${proficiencyLevel}"
    }
  ]
}`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${count} flashcards now.` }
      ],
      temperature: 0.8,
      max_tokens: mode === 'paragraphs' ? 2500 : 1500,
    })

    const responseText = completion.choices[0].message.content || '{}'
    
    // Parse JSON response
    let data
    try {
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      data = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Failed to parse flashcard data')
    }

    // Add unique IDs to each flashcard
    const flashcards = data.flashcards.map((card: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      word: card.word,
      meaning: card.meaning,
      example: card.example,
      exampleTranslation: card.exampleTranslation,
      level: card.level || proficiencyLevel,
      difficulty: 'medium' // Default difficulty
    }))

    return NextResponse.json({ flashcards })
  } catch (error: any) {
    console.error('Flashcard generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
}