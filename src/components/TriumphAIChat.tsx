import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  RefreshCw,
  Radio,
  ArrowRight,
  Globe,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Sliders,
  Settings2
} from 'lucide-react';
import {
  ChatMessage,
  processUserQuery,
  SupportedLanguage,
  detectLanguage,
  analyzeMultimodalImage
} from '../utils/triumphAiEngine';
import {
  normalizeRussianSpeech,
  getBestRussianVoice,
  getAllRussianVoices
} from '../utils/russianSpeechHelper';

interface TriumphAIChatProps {
  onNavigateTo: (sectionId: string, payload?: any) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: `Сәлеметсіз бе! Добро пожаловать в **TRIUMPH HALL**! 👑\n\nЯ — **TRIUMPH AI**, ваш персональный **мультимодальный голосовой ассистент** с улучшенной русской озвучкой.\n\n🎙️ **Голос:** Нажмите золотой микрофон и задайте вопрос вслух (например: *«Нас 100 человек, сколько будет стоить меню за 18 тысяч?»*).\n📸 **Фото:** Прикрепите фото блюда или зала, и я мгновенно скажу, есть ли оно в меню, его стоимость и состав!`,
    spokenText: `Здравствуйте! Я голосовой ассистент Triumph AI с улучшенной русской озвучкой. Нажмите на микрофон и задайте мне любой вопрос о меню, расчете банкета или покажите фотографию блюда.`,
    timestamp: 'Только что',
  },
];

export const TriumphAIChat: React.FC<TriumphAIChatProps> = ({ onNavigateTo }) => {
  // Modal & layout states
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'voice' | 'history'>('voice');
  const [hasUnread, setHasUnread] = useState(true);

  // Conversation & AI state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('triumph_ai_chat_history_v4');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Multimodal Image Attachment state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [continuousMode, setContinuousMode] = useState(true);
  const [preferredLang, setPreferredLang] = useState<'auto' | 'ru' | 'kk'>('auto');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  // Advanced Russian Voice Configuration
  const [availableRuVoices, setAvailableRuVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.95); // 0.95 gives calm, elegant banquet concierge tone
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // References
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldContinueRef = useRef(continuousMode);
  const attachedImageRef = useRef<string | null>(attachedImage);

  // Sync refs
  useEffect(() => {
    shouldContinueRef.current = continuousMode;
  }, [continuousMode]);

  useEffect(() => {
    attachedImageRef.current = attachedImage;
  }, [attachedImage]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('triumph_ai_chat_history_v4', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === 'history') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, isOpen, isMinimized, activeTab]);

  // Load and cache voices properly (handling asynchronous voiceschanged event)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const ruVoices = getAllRussianVoices(all);
      setAvailableRuVoices(ruVoices);

      if (ruVoices.length > 0) {
        // Choose best natural voice if none selected yet
        const best = getBestRussianVoice(ruVoices);
        if (best && !selectedVoiceURI) {
          setSelectedVoiceURI(best.voiceURI);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceAvailable(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = true;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognizer.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(final || interim);

      if (final) {
        handleUserSpeechFinal(final);
      }
    };

    recognizer.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setSpeechError('Доступ к микрофону заблокирован. Разрешите микрофон в настройках браузера.');
      } else if (event.error === 'no-speech') {
        // Just timeout
      } else {
        setSpeechError(`Ошибка распознавания: ${event.error}`);
      }
    };

    recognizer.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognizer;

    return () => {
      try {
        recognizer.abort();
      } catch {}
    };
  }, []);

  // Text-To-Speech (TTS) Speaker function with Enhanced Russian Accent & Natural Normalization
  const speakText = (textToSpeak: string, langHint: SupportedLanguage = 'ru') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Prepare speech text
    let spokenText = textToSpeak;

    // When speaking Russian, pass through phonetic normalizer
    if (langHint === 'ru') {
      spokenText = normalizeRussianSpeech(spokenText);
    } else {
      spokenText = spokenText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/[#•🏆✨🎁🌙🍽⭐👑💎🏛📍📅📸🥩🍖📺🏰✅💡]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    currentUtteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = langHint === 'kk' ? 'kk-KZ' : 'ru-RU';

    let voice: SpeechSynthesisVoice | null = null;

    if (langHint === 'ru') {
      // If user selected a specific voice in settings, use it
      if (selectedVoiceURI) {
        voice = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;
      }
      // Otherwise pick the best natural Russian voice (Google русский, MS Dmitry/Svetlana, Apple Milena/Yuri)
      if (!voice) {
        voice = getBestRussianVoice(voices);
      }
    } else {
      // Kazakh voice matching
      voice =
        voices.find((v) => v.lang.toLowerCase().startsWith('kk')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('ru')) ||
        null;
    }

    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = targetLangCode;
    utterance.rate = speechRate; // Smooth natural pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;

      // CONTINUOUS DIALOGUE: Automatically listen again if continuousMode is active
      if (shouldContinueRef.current && isOpen && !isMinimized) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  };

  const playVoiceSample = () => {
    const sample = 'Здравствуйте! Банкетный зал Триумф Холл в городе Атырау приветствует вас. Мы готовы рассчитать стоимость любого банкета на сто или двести гостей.';
    speakText(sample, 'ru');
  };

  const startListening = () => {
    stopSpeaking();

    if (!recognitionRef.current) {
      setSpeechError('Голосовой ввод не поддерживается вашим браузером. Рекомендуется использовать Chrome, Safari или Edge.');
      return;
    }

    setSpeechError(null);
    setLiveTranscript('');

    let langCode = 'ru-RU';
    if (preferredLang === 'kk') {
      langCode = 'kk-KZ';
    } else if (preferredLang === 'ru') {
      langCode = 'ru-RU';
    } else {
      langCode = 'ru-RU';
    }

    try {
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    } catch (err: any) {
      try {
        recognitionRef.current.abort();
        setTimeout(() => recognitionRef.current.start(), 100);
      } catch {}
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleUserSpeechFinal = (recognizedText: string) => {
    stopListening();
    const currentImg = attachedImageRef.current;
    if (currentImg) {
      handleMultimodalSubmit(currentImg, recognizedText);
    } else {
      processAndReply(recognizedText);
    }
  };

  const processAndReply = (userQueryText: string) => {
    const query = userQueryText.trim();
    if (!query) return;

    const detected = detectLanguage(query);
    const activeLang = preferredLang === 'auto' ? detected : preferredLang;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setLiveTranscript('');

    setTimeout(() => {
      const aiResponse = processUserQuery(query, messages, activeLang);

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiResponse.text,
        spokenText: aiResponse.spokenText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: aiResponse.actionButton,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);

      speakText(aiResponse.spokenText || aiResponse.text, aiResponse.detectedLang);
    }, 550);
  };

  const handleMultimodalSubmit = async (imageUrl: string, queryPrompt?: string) => {
    const promptText = (queryPrompt || inputValue || 'Что изображено на этом фото и есть ли это в TRIUMPH HALL?').trim();
    const detected = detectLanguage(promptText);
    const activeLang = preferredLang === 'auto' ? detected : preferredLang;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptText,
      image: imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAttachedImage(null);
    setIsProcessing(true);
    setLiveTranscript('');

    try {
      const analysis = await analyzeMultimodalImage(imageUrl, promptText, activeLang);

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: analysis.text,
        spokenText: analysis.spokenText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: analysis.actionButton,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);

      speakText(analysis.spokenText || analysis.text, analysis.detectedLang);
    } catch (err) {
      console.warn('Multimodal analysis error:', err);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedImage(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (attachedImage) {
      handleMultimodalSubmit(attachedImage, inputValue);
    } else if (inputValue.trim()) {
      processAndReply(inputValue);
    }
  };

  const handleActionButtonClick = (btn: ChatMessage['actionButton']) => {
    if (!btn) return;
    stopSpeaking();
    if (btn.actionType === 'open_menu') {
      onNavigateTo('menu');
    } else if (btn.actionType === 'open_calculator') {
      onNavigateTo('calculator', btn.payload);
    } else if (btn.actionType === 'open_booking') {
      onNavigateTo('booking', btn.payload);
    } else if (btn.actionType === 'call') {
      window.location.href = `tel:${btn.payload?.phone || '+77755309505'}`;
    }
  };

  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  // Sample photos for immediate 1-click testing
  const SAMPLE_PHOTOS = [
    { label: '🥩 Бешбармак', src: '/src/assets/images/culinary_beshbarmak_1790604158662.jpg', prompt: 'Что это за блюдо на фото и в какие меню оно входит?' },
    { label: '🍖 Мясное ассорти', src: '/src/assets/images/festive_appetizers_1790604412850.jpg', prompt: 'Определи эти холодные закуски и цены меню' },
    { label: '📺 Сцена и LED', src: '/src/assets/images/interior_stage_led_1790604135251.jpg', prompt: 'Расскажи про LED-экран и сцену на этом фото' },
    { label: '🍽 Сервировка', src: '/src/assets/images/banquet_table_setting_1790604147189.jpg', prompt: 'Как сервируются столы в зале?' },
    { label: '🏰 Здание', src: '/src/assets/images/triumph_hall_exterior_1790604391558.jpg', prompt: 'Где находится это здание и какой адрес?' },
  ];

  return (
    <>
      {/* Floating Gold Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0B0A09] via-[#171513] to-[#0B0A09] border-2 border-[#C9A227] text-[#F7F1E3] shadow-[0_0_30px_rgba(201,162,39,0.5)] hover:shadow-[0_0_45px_rgba(201,162,39,0.85)] transition-all transform hover:scale-105 cursor-pointer"
          aria-label="Open TRIUMPH AI Voice Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9A7617] via-[#C9A227] to-[#D8C08A] flex items-center justify-center text-[#0B0A09] shadow-md group-hover:rotate-12 transition-transform">
              <Mic className="w-5 h-5 text-[#0B0A09]" />
            </div>
            <span className="absolute -inset-1 rounded-full border border-[#C9A227] animate-ping opacity-60 pointer-events-none" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-xs font-bold text-gradient-gold tracking-wider">
                TRIUMPH AI
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] uppercase font-bold bg-[#C9A227]/20 text-[#D8C08A] border border-[#C9A227]/40">
                ГОЛОС RU + ФОТО
              </span>
            </div>
            <span className="text-[11px] text-[#D8C08A]/80 tracking-wide font-medium">
              Спросите вслух 🎙️📸
            </span>
          </div>

          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-[#0B0A09] rounded-full" />
          )}
        </button>
      )}

      {/* Main Luxury Voice & Multimodal AI Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72 sm:w-80 h-14 bg-[#0B0A09] border-2 border-[#C9A227] rounded-full shadow-2xl overflow-hidden'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[490px] h-[680px] max-h-[92vh] bg-[#0B0A09]/98 border-2 border-[#C9A227] rounded-sm shadow-[0_0_55px_rgba(201,162,39,0.38)] backdrop-blur-xl flex flex-col overflow-hidden'
          }`}
        >
          {/* Top Header Bar */}
          <div className="p-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#171513] via-[#0B0A09] to-[#171513] border-b border-[#C9A227]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9A7617] to-[#C9A227] flex items-center justify-center text-[#0B0A09] font-bold shadow-md">
                  <Mic className="w-4 h-4" />
                </div>
                {(isListening || isSpeaking) && (
                  <span className="absolute -inset-1 rounded-full border border-[#C9A227] animate-ping" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-sm font-bold text-[#F7F1E3] tracking-wider">
                    TRIUMPH <span className="text-[#C9A227]">AI</span>
                  </span>
                  <span className="text-[10px] text-[#D8C08A] bg-[#C9A227]/20 px-1.5 py-0.5 rounded border border-[#C9A227]/40 font-mono">
                    РУССКАЯ ОЗВУЧКА 🎙️
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#D8C08A]/75">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isListening
                        ? 'bg-red-500 animate-pulse'
                        : isSpeaking
                        ? 'bg-green-400 animate-pulse'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>
                    {isListening
                      ? 'Слушаю вас...'
                      : isSpeaking
                      ? 'Озвучиваю ответ на русском...'
                      : isProcessing
                      ? 'Анализирую...'
                      : 'Естественный русский голос активен'}
                  </span>
                </div>
              </div>
            </div>

            {/* Window control buttons */}
            <div className="flex items-center gap-1">
              {/* Voice settings toggle */}
              <button
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`p-1.5 rounded border transition-colors cursor-pointer mr-1 ${
                  showVoiceSettings
                    ? 'bg-[#C9A227] text-[#0B0A09] border-[#C9A227]'
                    : 'bg-[#171513] text-[#D8C08A] border-[#C9A227]/30 hover:border-[#C9A227]'
                }`}
                title="Настройки русской озвучки"
                aria-label="Voice settings"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>

              {/* Language pill */}
              <div className="flex items-center bg-[#171513] border border-[#C9A227]/30 rounded text-[10px] mr-1 overflow-hidden">
                <button
                  onClick={() => setPreferredLang('auto')}
                  className={`px-1.5 py-0.5 ${preferredLang === 'auto' ? 'bg-[#C9A227] text-[#0B0A09] font-bold' : 'text-[#D8C08A]'}`}
                  title="Автоматическое определение"
                >
                  АВТО
                </button>
                <button
                  onClick={() => setPreferredLang('ru')}
                  className={`px-1.5 py-0.5 ${preferredLang === 'ru' ? 'bg-[#C9A227] text-[#0B0A09] font-bold' : 'text-[#D8C08A]'}`}
                  title="Русский язык"
                >
                  РУС
                </button>
                <button
                  onClick={() => setPreferredLang('kk')}
                  className={`px-1.5 py-0.5 ${preferredLang === 'kk' ? 'bg-[#C9A227] text-[#0B0A09] font-bold' : 'text-[#D8C08A]'}`}
                  title="Қазақ тілі"
                >
                  ҚАЗ
                </button>
              </div>

              {/* Minimize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-[#D8C08A] hover:text-white rounded hover:bg-[#171513]"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  stopListening();
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 text-[#D8C08A] hover:text-white rounded hover:bg-[#171513]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Settings Drawer */}
          {showVoiceSettings && !isMinimized && (
            <div className="p-3.5 bg-[#171513] border-b border-[#C9A227]/40 text-xs text-[#F7F1E3] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#D8C08A] font-bold uppercase tracking-wider text-[11px]">
                  <Volume2 className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Параметры русской озвучки</span>
                </div>
                <button
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-[#D8C08A]/70 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Voice selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#D8C08A]/80 mb-1">
                  Русский голос синтезатора:
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full bg-[#0B0A09] border border-[#C9A227]/40 rounded px-2.5 py-1.5 text-xs text-[#F0D98A] focus:outline-none focus:border-[#C9A227]"
                >
                  {availableRuVoices.length > 0 ? (
                    availableRuVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  ) : (
                    <option value="">Естественный русский голос по умолчанию</option>
                  )}
                </select>
                <span className="text-[10px] text-[#D8C08A]/60 block mt-0.5">
                  Числа и тенге автоматически произносятся русскими словами без акцента
                </span>
              </div>

              {/* Speed & Test button */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase text-[#D8C08A]">Темп:</span>
                  {[0.85, 0.95, 1.05].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        speechRate === rate
                          ? 'bg-[#C9A227] text-[#0B0A09] border-[#C9A227]'
                          : 'bg-[#0B0A09] text-[#D8C08A] border-[#C9A227]/30'
                      }`}
                    >
                      {rate === 0.85 ? 'Спокойный' : rate === 0.95 ? 'Обычный' : 'Бодрый'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={playVoiceSample}
                  className="px-3 py-1.5 rounded bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm hover:brightness-110 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Тест голоса</span>
                </button>
              </div>
            </div>
          )}

          {/* Minimized bar body */}
          {isMinimized && (
            <div
              onClick={() => setIsMinimized(false)}
              className="flex-1 flex items-center justify-between px-4 cursor-pointer text-xs text-[#D8C08A]"
            >
              <span>Развернуть голосовой помощник</span>
              <Maximize2 className="w-4 h-4 text-[#C9A227]" />
            </div>
          )}

          {/* Expanded Content Body */}
          {!isMinimized && (
            <>
              {/* Tab Selector: Голосовой режим vs История сообщений */}
              <div className="flex border-b border-[#C9A227]/25 bg-[#171513]/60 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'voice'
                      ? 'border-[#C9A227] text-[#F0D98A] bg-[#0B0A09]/40'
                      : 'border-transparent text-[#D8C08A]/70 hover:text-[#F7F1E3]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Голосовой режим</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'history'
                      ? 'border-[#C9A227] text-[#F0D98A] bg-[#0B0A09]/40'
                      : 'border-transparent text-[#D8C08A]/70 hover:text-[#F7F1E3]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>История ({messages.length})</span>
                </button>
              </div>

              {/* TAB 1: DEDICATED VOICE & MULTIMODAL MODE */}
              {activeTab === 'voice' && (
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto">
                  {/* Top Status & Continuous Mode Switch */}
                  <div className="flex items-center justify-between bg-[#171513]/70 p-2.5 rounded-sm border border-[#C9A227]/30 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[#F7F1E3]">
                      <input
                        type="checkbox"
                        checked={continuousMode}
                        onChange={(e) => setContinuousMode(e.target.checked)}
                        className="accent-[#C9A227] w-3.5 h-3.5 rounded"
                      />
                      <span>Непрерывный голосовой диалог</span>
                    </label>

                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-red-900"
                      >
                        <VolumeX className="w-3 h-3" />
                        <span>Стоп звук</span>
                      </button>
                    )}
                  </div>

                  {/* Speech Error Banner */}
                  {speechError && (
                    <div className="my-2 p-2.5 rounded bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{speechError}</span>
                    </div>
                  )}

                  {/* Multimodal Attached Image Preview in Voice Mode */}
                  {attachedImage && (
                    <div className="my-2 p-2.5 rounded bg-[#171513] border border-[#C9A227] flex items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={attachedImage}
                          alt="Прикрепленное фото"
                          className="w-12 h-12 object-cover rounded border border-[#C9A227]/40"
                        />
                        <div className="text-left">
                          <span className="text-[11px] font-bold text-[#F0D98A] block">
                            Фото готово к анализу
                          </span>
                          <span className="text-[10px] text-[#D8C08A]/75">
                            Нажмите микрофон и спросите голосом
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="p-1 rounded bg-[#0B0A09] text-[#D8C08A] hover:text-white"
                        title="Удалить фото"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Center Interactive Luxury Sound Orb */}
                  <div className="my-auto py-2 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-5">
                      <div
                        className={`absolute -inset-4 rounded-full transition-all duration-700 blur-xl ${
                          isListening
                            ? 'bg-red-500/30 scale-125 animate-pulse'
                            : isSpeaking
                            ? 'bg-[#C9A227]/40 scale-125 animate-pulse'
                            : 'bg-[#C9A227]/15 scale-100'
                        }`}
                      />

                      <button
                        onClick={toggleListening}
                        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                          isListening
                            ? 'bg-gradient-to-br from-red-600 to-rose-800 text-white ring-8 ring-red-500/30 scale-105'
                            : isSpeaking
                            ? 'bg-gradient-to-br from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] ring-8 ring-[#C9A227]/30 animate-[pulse_2s_infinite]'
                            : isProcessing
                            ? 'bg-[#171513] text-[#C9A227] border-4 border-[#C9A227] animate-spin'
                            : 'bg-gradient-to-br from-[#171513] via-[#0B0A09] to-[#171513] border-4 border-[#C9A227] text-[#C9A227] hover:border-[#F0D98A] hover:scale-105'
                        }`}
                        aria-label="Toggle voice input"
                      >
                        {isProcessing ? (
                          <RefreshCw className="w-10 h-10 animate-spin text-[#C9A227]" />
                        ) : isListening ? (
                          <Mic className="w-10 h-10 animate-pulse text-white" />
                        ) : isSpeaking ? (
                          <Volume2 className="w-10 h-10 text-[#0B0A09]" />
                        ) : (
                          <Mic className="w-10 h-10 text-[#C9A227]" />
                        )}
                      </button>
                    </div>

                    {/* Audio Equalizer Waveform Animation */}
                    {(isListening || isSpeaking) && (
                      <div className="flex items-center justify-center gap-1.5 h-7 mb-3">
                        {[40, 75, 100, 60, 90, 45, 80, 65, 95, 50].map((h, idx) => (
                          <span
                            key={idx}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              isListening ? 'bg-red-400' : 'bg-[#C9A227]'
                            } animate-pulse`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Voice State Heading */}
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#F7F1E3] tracking-wide mb-1">
                      {isListening
                        ? 'СЛУШАЮ ВАС...'
                        : isSpeaking
                        ? 'TRIUMPH AI ГОВОРИТ (RU)'
                        : isProcessing
                        ? 'ОБРАБОТКА...'
                        : 'НАЖМИТЕ ДЛЯ ГОЛОСА'}
                    </h3>

                    {/* Live speech transcription text */}
                    {liveTranscript && (
                      <p className="text-xs sm:text-sm font-semibold text-[#F0D98A] bg-[#171513] px-3.5 py-1.5 rounded border border-[#C9A227]/40 max-w-sm mx-auto mt-2 animate-in fade-in">
                        «{liveTranscript}»
                      </p>
                    )}

                    {!liveTranscript && !isListening && !isSpeaking && !isProcessing && (
                      <p className="text-xs text-[#D8C08A]/75 max-w-xs mx-auto">
                        Задайте вопрос вслух. Произношение чисел, меню и цен адаптировано под чистую русскую речь.
                      </p>
                    )}
                  </div>

                  {/* 1-Click Multimodal Sample Photos */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5 text-[10px] text-[#D8C08A]/80">
                      <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#C9A227]" />
                        Примеры фото для мгновенной озвучки:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_PHOTOS.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMultimodalSubmit(sample.src, sample.prompt)}
                          className="px-2.5 py-1 rounded bg-[#171513] hover:bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#D8C08A] hover:text-[#FFFFFF] text-[10px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{sample.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Latest AI Answer Card Preview with Action Button */}
                  {lastAiMessage && (
                    <div className="p-3 rounded bg-[#171513]/90 border border-[#C9A227]/30 text-left text-xs mb-3">
                      <div className="flex items-center justify-between mb-1 text-[10px] text-[#D8C08A]">
                        <span className="font-bold uppercase tracking-wider">Последний ответ AI:</span>
                        {isSpeaking ? (
                          <span className="text-[#C9A227] flex items-center gap-1 animate-pulse">
                            <Volume2 className="w-3 h-3" />
                            Озвучивается...
                          </span>
                        ) : (
                          <button
                            onClick={() => speakText(lastAiMessage.spokenText || lastAiMessage.text, 'ru')}
                            className="text-[#C9A227] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            Повторить вслух
                          </button>
                        )}
                      </div>
                      <p className="text-[#F7F1E3] line-clamp-3 leading-relaxed text-[11px] sm:text-xs">
                        {lastAiMessage.spokenText || lastAiMessage.text.replace(/\*\*/g, '')}
                      </p>

                      {lastAiMessage.actionButton && (
                        <button
                          onClick={() => handleActionButtonClick(lastAiMessage.actionButton)}
                          className="mt-2 w-full py-1.5 px-3 rounded bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>{lastAiMessage.actionButton.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quick Voice Prompt Suggestions */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#D8C08A]/70 uppercase font-semibold block text-center">
                      Популярные вопросы для озвучивания:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        onClick={() => processAndReply('Нас 100 человек, сколько будет стоить меню за 18 000?')}
                        className="p-1.5 rounded bg-[#171513] hover:bg-[#171513]/80 border border-[#C9A227]/25 text-[#D8C08A] hover:text-[#FFFFFF] text-left text-[10px] truncate cursor-pointer"
                      >
                        «100 чел, меню 18 000?»
                      </button>
                      <button
                        onClick={() => processAndReply('Какие есть меню и цены?')}
                        className="p-1.5 rounded bg-[#171513] hover:bg-[#171513]/80 border border-[#C9A227]/25 text-[#D8C08A] hover:text-[#FFFFFF] text-left text-[10px] truncate cursor-pointer"
                      >
                        «Какие меню и цены?»
                      </button>
                      <button
                        onClick={() => processAndReply('Какая вместимость зала?')}
                        className="p-1.5 rounded bg-[#171513] hover:bg-[#171513]/80 border border-[#C9A227]/25 text-[#D8C08A] hover:text-[#FFFFFF] text-left text-[10px] truncate cursor-pointer"
                      >
                        «Вместимость зала?»
                      </button>
                      <button
                        onClick={() => processAndReply('Где вы находитесь?')}
                        className="p-1.5 rounded bg-[#171513] hover:bg-[#171513]/80 border border-[#C9A227]/25 text-[#D8C08A] hover:text-[#FFFFFF] text-left text-[10px] truncate cursor-pointer"
                      >
                        «Адрес и контакты?»
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL TEXT & MULTIMODAL HISTORY */}
              {activeTab === 'history' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[88%] rounded-sm p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                            msg.sender === 'user'
                              ? 'bg-[#C9A227] text-[#0B0A09] font-medium'
                              : 'bg-[#171513] border border-[#C9A227]/40 text-[#F7F1E3]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5 opacity-70 text-[10px]">
                            <span className="font-bold">
                              {msg.sender === 'user' ? 'Вы' : 'TRIUMPH AI'}
                            </span>
                            <span>{msg.timestamp}</span>
                          </div>

                          {/* Image preview in message */}
                          {msg.image && (
                            <div className="mb-2.5 rounded overflow-hidden border border-[#0B0A09]/40 max-h-48">
                              <img
                                src={msg.image}
                                alt="Анализируемое фото"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}

                          <div className="whitespace-pre-line text-[11px] sm:text-xs">
                            {msg.text.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line.startsWith('• ') ? (
                                  <span className="block pl-2">{line}</span>
                                ) : (
                                  line
                                )}
                                <br />
                              </React.Fragment>
                            ))}
                          </div>

                          {msg.actionButton && (
                            <button
                              onClick={() => handleActionButtonClick(msg.actionButton)}
                              className="mt-3 w-full py-2 px-3 rounded bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 transition-all cursor-pointer"
                            >
                              <span>{msg.actionButton.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {msg.sender === 'ai' && (
                          <button
                            onClick={() => speakText(msg.spokenText || msg.text, 'ru')}
                            className="text-[10px] text-[#D8C08A]/70 hover:text-[#C9A227] flex items-center gap-1 mt-1 pl-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Озвучить русским голосом</span>
                          </button>
                        )}
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex items-center gap-2 p-3 rounded bg-[#171513] border border-[#C9A227]/30 text-xs text-[#D8C08A] w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-ping" />
                        <span>TRIUMPH AI анализирует и готовит русскую озвучку...</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="px-4 py-1.5 bg-[#0B0A09] border-t border-[#C9A227]/15 flex justify-end">
                    <button
                      onClick={() => {
                        setMessages(INITIAL_MESSAGES);
                        try {
                          localStorage.removeItem('triumph_ai_chat_history_v4');
                        } catch {}
                      }}
                      className="text-[10px] text-[#D8C08A]/60 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Очистить историю</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Input Area */}
              <div className="p-3 bg-[#171513] border-t border-[#C9A227]/30">
                {/* Image attachment bar */}
                {attachedImage && (
                  <div className="mb-2 p-1.5 bg-[#0B0A09] rounded border border-[#C9A227]/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={attachedImage}
                        alt="Предпросмотр"
                        className="w-8 h-8 rounded object-cover border border-[#C9A227]/30"
                      />
                      <span className="text-[11px] text-[#D8C08A]">Фото прикреплено к вопросу</span>
                    </div>
                    <button
                      onClick={() => setAttachedImage(null)}
                      className="text-red-400 hover:text-red-200 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                  {/* Photo Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 text-[#C9A227] hover:border-[#C9A227] hover:bg-[#C9A227]/10 transition-all cursor-pointer"
                    title="Загрузить фото для анализа"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Microphone Quick Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-sm border transition-all cursor-pointer ${
                      isListening
                        ? 'bg-red-600 border-red-500 text-white animate-pulse'
                        : 'bg-[#0B0A09] border-[#C9A227]/50 text-[#C9A227] hover:border-[#C9A227]'
                    }`}
                    title={isListening ? 'Остановить запись' : 'Говорить в микрофон'}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      attachedImage
                        ? 'Спросите об этом фото или нажмите Enter...'
                        : 'Спросите голосом или напишите...'
                    }
                    className="flex-1 bg-[#0B0A09] border border-[#C9A227]/40 rounded-sm px-3.5 py-2 text-xs text-[#F7F1E3] placeholder-[#F7F1E3]/40 focus:outline-none focus:border-[#C9A227]"
                  />

                  <button
                    type="submit"
                    disabled={(!inputValue.trim() && !attachedImage) || isProcessing}
                    className="p-2.5 rounded-sm bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] disabled:opacity-40 transition-all cursor-pointer font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
