import { NextResponse } from 'next/server'
import axios from 'axios'

const languageCodeMap: Record<string, string> = {
  'en': 'EN',
  'es': 'ES',
  'fr': 'FR',
  'de': 'DE',
  'it': 'IT',
  'pt': 'PT-PT',
  'ja': 'JA',
  'ko': 'KO',
  'zh': 'ZH',
  'ru': 'RU',
  'pl': 'PL',
  'nl': 'NL',
  'ar': 'AR',       // Arabic
  'tr': 'TR',       // Turkish
  'sv': 'SV',       // Swedish
  'no': 'NB',       // Norwegian (Bokmål)
  'da': 'DA',       // Danish
  'fi': 'FI',       // Finnish
  'el': 'EL',       // Greek
  'id': 'ID',       // Indonesian
  'uk': 'UK',       // Ukrainian
  'cs': 'CS',       // Czech
  'ro': 'RO',       // Romanian
  'hu': 'HU',       // Hungarian
  'bg': 'BG',       // Bulgarian
  'sk': 'SK',       // Slovak
  'lt': 'LT',       // Lithuanian
  'lv': 'LV',       // Latvian
  'et': 'ET',       // Estonian
  'sl': 'SL',       // Slovenian
}

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json()

    if (!process.env.DEEPL_API_KEY) {
      return NextResponse.json(
        { error: 'DeepL API key not configured' },
        { status: 500 }
      )
    }

    const deeplTargetLang = languageCodeMap[targetLanguage]
    
    // If language not supported by DeepL, return message
    if (!deeplTargetLang) {
      return NextResponse.json({ 
        translation: `Translation to ${targetLanguage} is not available yet. DeepL doesn't support this language.`
      })
    }

    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: text,
          target_lang: deeplTargetLang,
        },
      }
    )

    const translation = response.data.translations[0].text

    return NextResponse.json({ translation })
  } catch (error: any) {
    console.error('DeepL API error:', error)
    
    // Fallback: Return original text if translation fails
    return NextResponse.json(
      { 
        translation: 'Translation unavailable. Please check your DeepL API key.',
        error: error.message 
      },
      { status: 200 }
    )
  }
}