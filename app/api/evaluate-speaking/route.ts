import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { audioData, scenario, targetLanguage, nativeLanguage, userLevel } = await req.json()

    const languageNames: { [key: string]: string } = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese'
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const nativeLangName = languageNames[nativeLanguage] || nativeLanguage

    // Step 1: Transcribe audio using Whisper
    console.log('Transcribing audio...')
    
    // Convert base64 to blob
    const base64Data = audioData.split(',')[1]
    const binaryData = Buffer.from(base64Data, 'base64')
    
    // Create form data for Whisper API
    const formData = new FormData()
    const audioBlob = new Blob([binaryData], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', targetLanguage)

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    })

    if (!transcriptionResponse.ok) {
      throw new Error(`Whisper API failed: ${transcriptionResponse.status}`)
    }

    const transcriptionData = await transcriptionResponse.json()
    const transcription = transcriptionData.text

    console.log('Transcription:', transcription)

    // Step 2: Evaluate the transcription using GPT
    const evaluationPrompt = `You are an expert language teacher evaluating a student's spoken response.

Student Details:
- Native Language: ${nativeLangName}
- Target Language: ${targetLangName}
- Level: ${userLevel}

Scenario Given:
"${scenario}"

Student's Response (transcribed):
"${transcription}"

Evaluate the response on these criteria (score 0-100 for each):
1. Grammar - correctness of grammar, sentence structure
2. Vocabulary - appropriate word choice, range of vocabulary
3. Fluency - natural flow, coherence, completeness of response
4. Pronunciation - inferred from transcription quality and accuracy

Provide:
- Overall score (average of 4 criteria)
- Detailed feedback for each criterion
- General feedback in ${nativeLangName} (the student's native language)
- Corrected version of what they said in ${targetLangName} (if errors exist)
- 3-5 specific suggestions for improvement in ${targetLangName}

Return ONLY valid JSON (no markdown, no backticks):
{
  "evaluation": {
    "overallScore": 85,
    "grammar": {
      "score": 80,
      "feedback": "Brief feedback about grammar"
    },
    "vocabulary": {
      "score": 85,
      "feedback": "Brief feedback about vocabulary"
    },
    "fluency": {
      "score": 90,
      "feedback": "Brief feedback about fluency"
    },
    "pronunciation": {
      "score": 85,
      "feedback": "Brief feedback about pronunciation"
    },
    "transcription": "${transcription}",
    "feedbackNative": "Detailed feedback in ${nativeLangName} explaining strengths and areas for improvement",
    "correctedVersion": "Corrected version in ${targetLangName} if errors exist, empty string if perfect",
    "suggestions": [
      "Suggestion 1 in ${targetLangName}",
      "Suggestion 2 in ${targetLangName}",
      "Suggestion 3 in ${targetLangName}"
    ]
  }
}

Be encouraging but honest. Provide constructive feedback.`

    const evaluationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert language teacher. You always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!evaluationResponse.ok) {
      const errorData = await evaluationResponse.json().catch(() => ({}))
      throw new Error(`Evaluation API failed: ${evaluationResponse.status} - ${JSON.stringify(errorData)}`)
    }

    const evaluationData = await evaluationResponse.json()
    let contentText = evaluationData.choices[0].message.content

    // Remove markdown code blocks if present
    contentText = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsedEvaluation = JSON.parse(contentText)

    return NextResponse.json(parsedEvaluation)
  } catch (error) {
    console.error('Error evaluating speech:', error)
    
    return NextResponse.json({
      error: 'Failed to evaluate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}