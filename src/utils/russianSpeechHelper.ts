// Helper to convert numbers and banquet terminology into natural spoken Russian for SpeechSynthesis

function numberToRussianWords(num: number): string {
  if (num === 0) return 'ноль';

  const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = [
    'десять',
    'одиннадцать',
    'двенадцать',
    'тринадцать',
    'четырнадцать',
    'пятнадцать',
    'шестнадцать',
    'семнадцать',
    'восемнадцать',
    'девятнадцать',
  ];
  const tens = [
    '',
    '',
    'двадцать',
    'тридцать',
    'сорок',
    'пятьдесят',
    'шестьдесят',
    'семьдесят',
    'восемьдесят',
    'девяносто',
  ];
  const hundreds = [
    '',
    'сто',
    'двести',
    'триста',
    'четыреста',
    'пятьсот',
    'шестьсот',
    'семьсот',
    'восемьсот',
    'девятьсот',
  ];

  function convertHundreds(n: number, isFemale = false): string {
    const res: string[] = [];
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const t = Math.floor(rem / 10);
    const u = rem % 10;

    if (h > 0) res.push(hundreds[h]);
    if (rem >= 10 && rem <= 19) {
      res.push(teens[rem - 10]);
    } else {
      if (t > 0) res.push(tens[t]);
      if (u > 0) {
        if (isFemale && u === 1) res.push('одна');
        else if (isFemale && u === 2) res.push('две');
        else res.push(units[u]);
      }
    }
    return res.join(' ');
  }

  // Handle millions
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  const parts: string[] = [];

  if (millions > 0) {
    const milWords = convertHundreds(millions, false);
    let milSuffix = 'миллионов';
    const lastTwo = millions % 100;
    const lastOne = millions % 10;
    if (lastTwo < 10 || lastTwo > 20) {
      if (lastOne === 1) milSuffix = 'миллион';
      else if (lastOne >= 2 && lastOne <= 4) milSuffix = 'миллиона';
    }
    parts.push(`${milWords} ${milSuffix}`);
  }

  if (thousands > 0) {
    const thWords = convertHundreds(thousands, true);
    let thSuffix = 'тысяч';
    const lastTwo = thousands % 100;
    const lastOne = thousands % 10;
    if (lastTwo < 10 || lastTwo > 20) {
      if (lastOne === 1) thSuffix = 'тысяча';
      else if (lastOne >= 2 && lastOne <= 4) thSuffix = 'тысячи';
    }
    parts.push(`${thWords} ${thSuffix}`);
  }

  if (remainder > 0 || parts.length === 0) {
    const remWords = convertHundreds(remainder, false);
    if (remWords) parts.push(remWords);
  }

  return parts.join(' ').trim();
}

/**
 * Normalizes Russian text so Web Speech Synthesis pronounces numbers,
 * currency, and brand names with a natural, clear Russian accent.
 */
export function normalizeRussianSpeech(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Remove markdown, emojis, asterisks
  res = res
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/[#•🏆✨🎁🌙🍽⭐👑💎🏛📍📅📸🥩🍖📺🏰✅💡🔊🎙️]/g, ' ')
    .replace(/["«»]/g, ' ');

  // 2. Expand common abbreviations
  res = res.replace(/\bг\.\s*Атырау/gi, 'городе Атырау');
  res = res.replace(/\bпр\.\s*Султан/gi, 'проспекте Султан');
  res = res.replace(/\bул\.\s*Дангылы/gi, 'улице Дангылы');
  res = res.replace(/\bчел\b/gi, 'человек');
  res = res.replace(/\bLED\b/gi, 'лэд');
  res = res.replace(/\b4K\b/gi, 'четыре ка');
  res = res.replace(/\bVIP\b/gi, 'ви ай пи');
  res = res.replace(/\bDJ\b/gi, 'диджей');
  res = res.replace(/\bTRIUMPH\s*HALL\b/gi, 'Триумф Холл');
  res = res.replace(/\bTRIUMPH\s*AI\b/gi, 'Триумф А и');

  // 3. Convert numbers with currency symbol "₸" or "тенге"
  // e.g. "1 800 000 ₸", "18 000 ₸", "18000 тг", "8 000 тенге"
  res = res.replace(/(\d[\d\s]*\d|\d+)\s*(?:₸|тг|тенге|теңге)/gi, (_, numberStr) => {
    const num = parseInt(numberStr.replace(/\s+/g, ''), 10);
    if (isNaN(num)) return _;
    const words = numberToRussianWords(num);
    let currencyWord = 'тенге';
    const lastTwo = num % 100;
    const lastOne = num % 10;
    if (lastTwo < 10 || lastTwo > 20) {
      if (lastOne === 1) currencyWord = 'тенге';
      else if (lastOne >= 2 && lastOne <= 4) currencyWord = 'тенге';
    }
    return `${words} ${currencyWord}`;
  });

  // 4. Convert numbers followed by "гостей" / "человек"
  // e.g. "100 гостей" -> "сто гостей", "50 человек" -> "пятьдесят человек"
  res = res.replace(/(\d+)\s*(гост[ей|я|ем]*|человек|персон[ы|]?)/gi, (_, numStr, noun) => {
    const num = parseInt(numStr, 10);
    if (!isNaN(num) && num <= 1000) {
      return `${numberToRussianWords(num)} ${noun}`;
    }
    return _;
  });

  // 5. Expand range "256–450"
  res = res.replace(/256[\s–-]+450/g, 'от двухсот пятидесяти шести до четырехсот пятидесяти');
  res = res.replace(/200[\s–-]+5\s*000/g, 'от двухсот до пяти тысяч');

  // 6. Clean whitespace and pauses
  res = res
    .replace(/[–—]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return res;
}

/**
 * Finds the highest quality Russian natural voice available in the browser.
 * Prioritizes natural and online neural voices: Google русский, Microsoft Natural, Apple Milena/Yuri.
 */
export function getBestRussianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Filter all Russian voices
  const ruVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('ru') ||
      v.lang.toLowerCase().includes('ru-ru') ||
      v.name.toLowerCase().includes('russian') ||
      v.name.toLowerCase().includes('русский')
  );

  if (ruVoices.length === 0) return null;

  // 1. Google Chrome Russian natural voice
  const googleRu = ruVoices.find((v) => v.name.toLowerCase().includes('google') && v.lang.toLowerCase().startsWith('ru'));
  if (googleRu) return googleRu;

  // 2. Microsoft Natural Online voices (Edge & Windows 11)
  const msNatural = ruVoices.find(
    (v) =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('dmitry') ||
      v.name.toLowerCase().includes('svetlana')
  );
  if (msNatural) return msNatural;

  // 3. Apple premium/enhanced voices (Safari, iOS, macOS)
  const appleEnhanced = ruVoices.find(
    (v) =>
      v.name.toLowerCase().includes('milena') ||
      v.name.toLowerCase().includes('yuri') ||
      v.name.toLowerCase().includes('enhanced') ||
      v.name.toLowerCase().includes('premium')
  );
  if (appleEnhanced) return appleEnhanced;

  // 4. Microsoft standard Russian voices (Pavel, Irina)
  const msStandard = ruVoices.find(
    (v) => v.name.toLowerCase().includes('irina') || v.name.toLowerCase().includes('pavel')
  );
  if (msStandard) return msStandard;

  // 5. Any other Russian voice
  return ruVoices[0];
}

/**
 * Returns all available Russian voices on the current device.
 */
export function getAllRussianVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('ru') ||
      v.name.toLowerCase().includes('russian') ||
      v.name.toLowerCase().includes('русский')
  );
}
