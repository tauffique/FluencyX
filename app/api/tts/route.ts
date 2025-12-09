import { NextResponse } from 'next/server'
import axios from 'axios'

const languageVoiceMap: Record<string, { languageCode: string; voiceName: string }> = {
  'en': { languageCode: 'en-US', voiceName: 'en-US-Neural2-D' },
  'es': { languageCode: 'es-ES', voiceName: 'es-ES-Neural2-A' },
  'fr': { languageCode: 'fr-FR', voiceName: 'fr-FR-Neural2-A' },
  'de': { languageCode: 'de-DE', voiceName: 'de-DE-Neural2-B' },
  'it': { languageCode: 'it-IT', voiceName: 'it-IT-Neural2-A' },
  'pt': { languageCode: 'pt-PT', voiceName: 'pt-PT-Neural2-A' },
  'ja': { languageCode: 'ja-JP', voiceName: 'ja-JP-Neural2-B' },
  'ko': { languageCode: 'ko-KR', voiceName: 'ko-KR-Neural2-A' },
  'zh': { languageCode: 'cmn-CN', voiceName: 'cmn-CN-Standard-A' },
  'ar': { languageCode: 'ar-XA', voiceName: 'ar-XA-Standard-A' },
  'ru': { languageCode: 'ru-RU', voiceName: 'ru-RU-Standard-A' },
  'hi': { languageCode: 'hi-IN', voiceName: 'hi-IN-Standard-A' },
}

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json()

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    const voiceConfig = languageVoiceMap[language] || languageVoiceMap['en']

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        input: { text },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1.0,
        },
      }
    )

    const audioContent = response.data.audioContent

    return NextResponse.json({ audio: audioContent })
  } catch (error: any) {
    console.error('Google TTS API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    )
  }
}