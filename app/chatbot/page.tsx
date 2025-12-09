'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Mic, Volume2, Languages, Loader2, StopCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  translatedContent?: string
  showTranslation?: boolean
  timestamp: Date
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Get both languages from localStorage
    const target = localStorage.getItem('targetLanguage')
    const native = localStorage.getItem('nativeLanguage') || 'en'
    
    console.log('Chatbot loaded with:', { native, target })
    
    if (target) {
      setTargetLanguage(target)
      setNativeLanguage(native)
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    // Add welcome message
    if (messages.length === 0 && target) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(target),
        timestamp: new Date()
      }])
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getWelcomeMessage = (lang: string) => {
    const welcomeMessages: Record<string, string> = {
      'es': '¡Hola! Soy tu asistente de IA. Puedes escribir o hablar en cualquier idioma y te responderé en español. ¿Cómo puedo ayudarte hoy?',
      'fr': 'Bonjour! Je suis votre assistant IA. Vous pouvez écrire ou parler dans n\'importe quelle langue et je vous répondrai en français. Comment puis-je vous aider aujourd\'hui?',
      'de': 'Hallo! Ich bin dein KI-Assistent. Du kannst in jeder Sprache schreiben oder sprechen und ich werde dir auf Deutsch antworten. Wie kann ich dir heute helfen?',
      'it': 'Ciao! Sono il tuo assistente AI. Puoi scrivere o parlare in qualsiasi lingua e ti risponderò in italiano. Come posso aiutarti oggi?',
      'pt': 'Olá! Sou seu assistente de IA. Você pode escrever ou falar em qualquer idioma e responderei em português. Como posso ajudá-lo hoje?',
      'ja': 'こんにちは！私はあなたのAIアシスタントです。どの言語でも書いたり話したりできます。日本語でお答えします。今日はどのようにお手伝いできますか？',
      'ko': '안녕하세요! 저는 AI 어시스턴트입니다. 어떤 언어로든 쓰거나 말할 수 있으며 한국어로 답변드리겠습니다. 오늘 어떻게 도와드릴까요?',
      'zh': '你好！我是你的AI助手。你可以用任何语言书写或说话，我会用中文回答。今天我能帮你什么？',
      'ru': 'Здравствуйте! Я ваш AI-ассистент. Вы можете писать или говорить на любом языке, и я отвечу на русском. Чем я могу вам помочь сегодня?',
      'ar': 'مرحبا! أنا مساعد الذكاء الاصطناعي الخاص بك. يمكنك الكتابة أو التحدث بأي لغة وسأجيب باللغة العربية. كيف يمكنني مساعدتك اليوم؟',
      'hi': 'नमस्ते! मैं आपका AI सहायक हूं। आप किसी भी भाषा में लिख या बोल सकते हैं और मैं हिंदी में जवाब दूंगा। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'tr': 'Merhaba! Ben senin yapay zeka asistanınım. Herhangi bir dilde yazabilir veya konuşabilirsin ve ben Türkçe cevap vereceğim. Bugün sana nasıl yardımcı olabilirim?',
      'nl': 'Hallo! Ik ben je AI-assistent. Je kunt in elke taal schrijven of spreken en ik zal in het Nederlands antwoorden. Hoe kan ik je vandaag helpen?',
      'pl': 'Cześć! Jestem twoim asystentem AI. Możesz pisać lub mówić w dowolnym języku, a ja odpowiem po polsku. Jak mogę ci dzisiaj pomóc?',
      'sv': 'Hej! Jag är din AI-assistent. Du kan skriva eller prata på vilket språk som helst och jag svarar på svenska. Hur kan jag hjälpa dig idag?',
      'no': 'Hei! Jeg er din AI-assistent. Du kan skrive eller snakke på hvilket som helst språk, og jeg vil svare på norsk. Hvordan kan jeg hjelpe deg i dag?',
      'da': 'Hej! Jeg er din AI-assistent. Du kan skrive eller tale på ethvert sprog, og jeg vil svare på dansk. Hvordan kan jeg hjælpe dig i dag?',
      'fi': 'Hei! Olen tekoälyavustajasi. Voit kirjoittaa tai puhua millä tahansa kielellä ja vastaan suomeksi. Miten voin auttaa sinua tänään?',
      'el': 'Γεια σας! Είμαι ο βοηθός AI σας. Μπορείτε να γράψετε ή να μιλήσετε σε οποιαδήποτε γλώσσα και θα απαντήσω στα ελληνικά. Πώς μπορώ να σας βοηθήσω σήμερα?',
      'he': 'שלום! אני עוזר הבינה המלאכותית שלך. אתה יכול לכתוב או לדבר בכל שפה ואני אענה בעברית. איך אני יכול לעזור לך היום?',
      'th': 'สวัสดี! ฉันเป็นผู้ช่วย AI ของคุณ คุณสามารถเขียนหรือพูดเป็นภาษาใดก็ได้ และฉันจะตอบเป็นภาษาไทย วันนี้ฉันจะช่วยคุณได้อย่างไร?',
      'vi': 'Xin chào! Tôi là trợ lý AI của bạn. Bạn có thể viết hoặc nói bằng bất kỳ ngôn ngữ nào và tôi sẽ trả lời bằng tiếng Việt. Hôm nay tôi có thể giúp gì cho bạn?',
      'id': 'Halo! Saya asisten AI Anda. Anda dapat menulis atau berbicara dalam bahasa apa pun dan saya akan menjawab dalam bahasa Indonesia. Bagaimana saya bisa membantu Anda hari ini?',
      'en': 'Hello! I\'m your AI assistant. You can write or speak in any language and I\'ll respond in English. How can I help you today?',
    }
    return welcomeMessages[lang] || 'Hello! I\'m your AI assistant. You can write or speak in any language and I\'ll respond in your target language. How can I help you today?'
  }

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'ru': 'Russian',
      'tr': 'Turkish', 'nl': 'Dutch', 'pl': 'Polish', 'sv': 'Swedish',
      'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'el': 'Greek',
      'he': 'Hebrew', 'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian'
    }
    return names[code] || code.toUpperCase()
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call API to get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          targetLanguage: targetLanguage,
          nativeLanguage: nativeLanguage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure your API keys are configured correctly.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTranslate = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    if (message.showTranslation) {
      // Toggle off
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, showTranslation: false } : m
      ))
      return
    }

    if (message.translatedContent) {
      // Already translated, just show it
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, showTranslation: true } : m
      ))
      return
    }

    try {
      // Call translation API - translate to NATIVE language
      console.log('Translation request:', {
        text: message.content,
        from: targetLanguage,
        to: nativeLanguage
      })
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message.content,
          targetLanguage: nativeLanguage, // Translate TO native language
          sourceLanguage: targetLanguage  // FROM target language
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      console.log('Translation response:', data)

      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, translatedContent: data.translation, showTranslation: true } 
          : m
      ))
    } catch (error) {
      console.error('Translation error:', error)
      alert('Translation failed. Please check your DeepL API key.')
    }
  }

  const handleSpeak = async (text: string, messageId: string) => {
    if (isSpeaking === messageId) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis.cancel()
      setIsSpeaking(null)
      return
    }

    // Stop any previous audio first
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()

    try {
      setIsSpeaking(messageId)
      
      // Call TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: targetLanguage // Speak in TARGET language
        })
      })

      if (!response.ok) {
        throw new Error('TTS failed')
      }

      const data = await response.json()
      
      // Play audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsSpeaking(null)
        audioRef.current = null
      }
      
      audio.onerror = () => {
        setIsSpeaking(null)
        audioRef.current = null
        // Fallback to browser TTS
        useBrowserTTS(text, messageId)
      }
      
      audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to browser TTS
      useBrowserTTS(text, messageId)
    }
  }

  const useBrowserTTS = (text: string, messageId: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = targetLanguage
    utterance.onend = () => {
      setIsSpeaking(null)
    }
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(messageId)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
            </Link>
            <div className="text-center">
              <h1 className="font-sora text-lg font-bold text-gray-900">AI Chatbot</h1>
              <p className="text-xs text-gray-500">Learning {getLanguageName(targetLanguage)}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Translation and Voice buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleTranslate(message.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Languages className="w-3 h-3" />
                        <span>{message.showTranslation ? 'Hide' : 'Translate'}</span>
                      </button>
                      <button
                        onClick={() => handleSpeak(message.content, message.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isSpeaking === message.id
                            ? 'bg-red-50 hover:bg-red-100 text-red-600'
                            : 'bg-green-50 hover:bg-green-100 text-green-600'
                        }`}
                      >
                        {isSpeaking === message.id ? (
                          <>
                            <StopCircle className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Translation text */}
                  {message.showTranslation && message.translatedContent && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-900">{message.translatedContent}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Translation to {getLanguageName(nativeLanguage)}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end space-x-2">
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type or speak your message in any language..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                style={{ maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {isListening && (
            <p className="text-sm text-red-600 mt-2 text-center animate-pulse">
              🎤 Listening... Speak now
            </p>
          )}
        </div>
      </div>
    </div>
  )
}