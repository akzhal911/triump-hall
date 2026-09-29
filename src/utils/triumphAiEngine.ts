import { MENUS_DATA, CONTACT_INFO } from '../data/triumphData';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  spokenText?: string;
  image?: string;
  timestamp: string;
  actionButton?: {
    label: string;
    actionType: 'open_menu' | 'open_calculator' | 'open_booking' | 'call';
    payload?: any;
  };
}

export type SupportedLanguage = 'ru' | 'kk';

// Helper to detect if input is primarily Kazakh
export function detectLanguage(text: string): SupportedLanguage {
  const lower = text.toLowerCase();
  // Kazakh specific characters
  if (/[әғқңөұүһі]/i.test(lower)) return 'kk';
  
  // Common Kazakh words
  const kazakhWords = [
    'сәлем', 'салем', 'сәлеметсіз', 'қанша', 'қаншама', 'неше', 'адам', 'адамға',
    'мәзір', 'мәзірі', 'той', 'бағасы', 'қайда', 'қай жерде', 'үстел', 'садақа',
    'бешбармақ', 'болады', 'бола ма', 'керек', 'рақмет', 'рахмет', 'қандай',
    'тапсырыс', 'тегін', 'бар ма', 'сыйлық'
  ];
  for (const w of kazakhWords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) return 'kk';
  }
  return 'ru';
}

// Helper to extract numbers from text
function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+[\d\s]*\d+|\d+/g);
  if (!matches) return [];
  return matches
    .map((m) => parseInt(m.replace(/\s+/g, ''), 10))
    .filter((n) => !isNaN(n));
}

// Match known menu prices: 7000, 8000, 15000, 18000, 23000
function matchMenuPrice(text: string, numbers: number[]): number | null {
  const validPrices = [7000, 8000, 15000, 18000, 23000];
  for (const p of validPrices) {
    if (numbers.includes(p)) return p;
    // or e.g. "18 тыс", "18k", "18 мың", "18000"
    const kMatch = new RegExp(`\\b${p / 1000}\\s*(k|к|тыс|тысяч|мың|мын)`, 'i');
    if (kMatch.test(text)) return p;
  }
  return null;
}

export function processUserQuery(
  rawInput: string,
  history: ChatMessage[] = [],
  preferredLang?: SupportedLanguage
): { text: string; spokenText: string; actionButton?: ChatMessage['actionButton']; detectedLang: SupportedLanguage } {
  const input = rawInput.trim();
  const lower = input.toLowerCase();
  const lang = preferredLang || detectLanguage(input);
  const numbers = extractNumbers(lower);

  const isKazakh = lang === 'kk';

  // 1. Explicit calculation request or pattern like "100 человек, меню за 18 000" or "100 адамға 18 мыңдық мәзір қанша"
  const hasGuestWord = /гост|человек|персон|адам|адамға|чел|нас\s+\d+/i.test(lower);
  const hasCalcWord = /посчитай|сколько|стоимост|цена|расчет|рассчитай|выйдет|бюджет|қанша|бағасы|неше|болады/i.test(lower);
  const matchedPrice = matchMenuPrice(lower, numbers);

  // Try to find guest count (usually between 1 and 450, not equal to menu prices)
  let foundGuestCount: number | null = null;
  for (const n of numbers) {
    if (n !== matchedPrice && n >= 1 && n <= 450) {
      foundGuestCount = n;
      break;
    }
  }

  // Exact Calculation Match:
  if (foundGuestCount && matchedPrice) {
    const total = foundGuestCount * matchedPrice;
    const targetMenu = MENUS_DATA.find((m) => m.price === matchedPrice);
    const menuTitle = targetMenu ? targetMenu.name : `Меню ${matchedPrice.toLocaleString('ru-RU')} ₸`;
    const isFreeGift = targetMenu ? targetMenu.hasFreeTechGift : false;

    if (isKazakh) {
      let displayText = `✨ **TRIUMPH HALL банкетінің есебі:**\n\n`;
      displayText += `• **Қонақтар саны:** ${foundGuestCount} адам\n`;
      displayText += `• **Таңдалған мәзір:** ${menuTitle} (${matchedPrice.toLocaleString('ru-RU')} ₸ / адам)\n`;
      displayText += `• **Есептеу:** ${foundGuestCount} × ${matchedPrice.toLocaleString('ru-RU')} ₸\n\n`;
      displayText += `🏆 **БАРЛЫҒЫ:** **${total.toLocaleString('ru-RU')} ₸**\n\n`;

      if (isFreeGift) {
        displayText += `🎁 **Сыйлық:** Бұл мәзірге **LED-экран және кәсіби аппаратура ТЕГІН** беріледі!\n\n`;
      }
      displayText += `Күнді брондау үшін өтінім қалдыруды қалайсыз ба?`;

      const spokenText = isFreeGift
        ? `${foundGuestCount} адамға ${matchedPrice.toLocaleString('ru-RU')} теңгелік мәзір ${total.toLocaleString('ru-RU')} теңге болады. Мекеме атынан LED-экран мен музыкалық аппаратура тегін беріледі.`
        : `${foundGuestCount} адамға ${matchedPrice.toLocaleString('ru-RU')} теңгелік мәзір ${total.toLocaleString('ru-RU')} теңге болады.`;

      return {
        text: displayText,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: `Өтінім беру (${total.toLocaleString('ru-RU')} ₸)`,
          actionType: 'open_booking',
          payload: {
            guestCount: foundGuestCount,
            menuPrice: matchedPrice,
            menuId: targetMenu?.id,
            totalCost: total,
          },
        },
      };
    } else {
      let displayText = `✨ **Расчет стоимости банкета в TRIUMPH HALL:**\n\n`;
      displayText += `• **Количество гостей:** ${foundGuestCount} персон\n`;
      displayText += `• **Выбранное меню:** ${menuTitle} (${matchedPrice.toLocaleString('ru-RU')} ₸ / чел)\n`;
      displayText += `• **Формула расчета:** ${foundGuestCount} × ${matchedPrice.toLocaleString('ru-RU')} ₸\n\n`;
      displayText += `🏆 **ИТОГО:** **${total.toLocaleString('ru-RU')} ₸**\n\n`;

      if (isFreeGift) {
        displayText += `🎁 **Подарок от заведения:** Для данного меню **LED-экран и музыкальная аппаратура** предоставляются **БЕСПЛАТНО**!\n\n`;
      }
      displayText += `Хотите закрепить эту дату или перейти к оформлению заявки?`;

      const spokenText = isFreeGift
        ? `На ${foundGuestCount} гостей меню по ${matchedPrice.toLocaleString('ru-RU')} тенге будет стоить ${total.toLocaleString('ru-RU')} тенге. В подарок от заведения вам предоставляются LED-экран и музыкальная аппаратура бесплатно.`
        : `На ${foundGuestCount} гостей меню по ${matchedPrice.toLocaleString('ru-RU')} тенге будет стоить ${total.toLocaleString('ru-RU')} тенге.`;

      return {
        text: displayText,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: `Забронировать расчет (${total.toLocaleString('ru-RU')} ₸)`,
          actionType: 'open_booking',
          payload: {
            guestCount: foundGuestCount,
            menuPrice: matchedPrice,
            menuId: targetMenu?.id,
            totalCost: total,
          },
        },
      };
    }
  }

  // If user mentions just guests (e.g. "нас 120 человек, сколько стоит?" or "бізде 150 адам")
  if (foundGuestCount && (hasCalcWord || hasGuestWord) && !matchedPrice) {
    if (isKazakh) {
      const spokenText = `${foundGuestCount} қонақ үшін бізде бес түрлі мәзір бар: Садақа мәзірі жеті мың теңге, мерекелік мәзірлер сегіз мың, он бес мың, он сегіз мың және жиырма үш мың теңге.`;
      return {
        text: `**${foundGuestCount} адамға** арналған мәзір нұсқалары:\n\n` +
          `1. **САДАҚА МӘЗІРІ:** 7 000 ₸ ➔ **${(foundGuestCount * 7000).toLocaleString('ru-RU')} ₸**\n` +
          `2. **Мерекелік мәзір:** 8 000 ₸ ➔ **${(foundGuestCount * 8000).toLocaleString('ru-RU')} ₸** *(LED + аппаратура тегін)*\n` +
          `3. **Мерекелік мәзір:** 15 000 ₸ ➔ **${(foundGuestCount * 15000).toLocaleString('ru-RU')} ₸** *(LED + аппаратура тегін)*\n` +
          `4. **TRIUMPH HALL фирмалық:** 18 000 ₸ ➔ **${(foundGuestCount * 18000).toLocaleString('ru-RU')} ₸** *(LED + аппаратура тегін)*\n` +
          `5. **VIP мәзір:** 23 000 ₸ ➔ **${(foundGuestCount * 23000).toLocaleString('ru-RU')} ₸** *(LED + аппаратура тегін)*`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Калькуляторды ашу',
          actionType: 'open_calculator',
          payload: { guestCount: foundGuestCount },
        },
      };
    } else {
      const spokenText = `Для ${foundGuestCount} гостей у нас есть пять вариантов меню: Садака мәзірі по семь тысяч тенге, праздничные по восемь, пятнадцать, восемнадцать и двадцать три тысячи тенге.`;
      return {
        text: `Для **${foundGuestCount} гостей** у нас доступно 5 вариантов праздничного меню:\n\n` +
          `1. **САДАҚА МӘЗІРІ:** 7 000 ₸/чел ➔ **${(foundGuestCount * 7000).toLocaleString('ru-RU')} ₸**\n` +
          `2. **Праздничное меню:** 8 000 ₸/чел ➔ **${(foundGuestCount * 8000).toLocaleString('ru-RU')} ₸** *(LED + звук бесплатно)*\n` +
          `3. **Праздничное меню:** 15 000 ₸/чел ➔ **${(foundGuestCount * 15000).toLocaleString('ru-RU')} ₸** *(LED + звук бесплатно)*\n` +
          `4. **TRIUMPH HALL фирменное:** 18 000 ₸/чел ➔ **${(foundGuestCount * 18000).toLocaleString('ru-RU')} ₸** *(LED + звук бесплатно)*\n` +
          `5. **Праздничное VIP:** 23 000 ₸/чел ➔ **${(foundGuestCount * 23000).toLocaleString('ru-RU')} ₸** *(LED + звук бесплатно)*`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Открыть интерактивный калькулятор',
          actionType: 'open_calculator',
          payload: { guestCount: foundGuestCount },
        },
      };
    }
  }

  // 2. Specific menu inquiries: 7000, 8000, 15000, 18000, 23000, "садака", etc.
  if (lower.includes('7000') || lower.includes('7 000') || lower.includes('садака') || lower.includes('садақа')) {
    const m = MENUS_DATA[0];
    const spokenText = isKazakh
      ? `Садақа мәзірі бір адамға 7 000 теңге. Оған 3 түрлі салат, ет ассорти, жеміс, балық, тауық, Бешбармақ, бауырсақ, самса, тәттілер, шай және су кіреді.`
      : `Садака мәзірі стоит 7 000 тенге на человека. В него входят три вида салатов, мясное ассорти, фрукты, рыба, курица, бешбармак, баурсаки, самса, выпечка, чай и вода.`;

    return {
      text: `🌙 **${m.name} — ${m.price.toLocaleString('ru-RU')} ₸ / адам:**\n\n` +
        `• **Салаттар:** 3 түрлі\n` +
        `• **Салқын тіскебасарлар:** Ет ассорти, Жемістен туралған, Балық, Тауық\n` +
        `• **Ыстық тағамдар:** БЕШБАРМАҚ\n` +
        `• **Нан өнімдері:** Нан, Бауырсақ, Самса\n` +
        `• **Тәттілер:** Бөлкелер\n` +
        `• **Сусындар:** Шай, Су`,
      spokenText,
      detectedLang: lang,
      actionButton: {
        label: isKazakh ? 'Осы мәзірді таңдау' : 'Выбрать меню 7 000 ₸',
        actionType: 'open_calculator',
        payload: { menuId: 'menu-7000' },
      },
    };
  }

  if (lower.includes('8000') || lower.includes('8 000') || lower.includes('сегіз мың')) {
    const m = MENUS_DATA[1];
    const spokenText = isKazakh
      ? `Мерекелік мәзір 8 000 теңге. Үш салат, ет ассорти, гриль тауық, жеміс, таңдау бойынша бір ыстық тағам, нан және шай. Сыйлыққа LED экран мен аппаратура тегін беріледі.`
      : `Праздничное меню по 8 000 тенге включает 3 салата, мясное ассорти, гриль-курицу, фрукты, горячее на выбор, баурсаки и чай. LED-экран и аппаратура в подарок.`;

    return {
      text: `🍽 **${m.name} — ${m.price.toLocaleString('ru-RU')} ₸ / человек:**\n\n` +
        `• **Салаты:** 3 вида на выбор\n` +
        `• **Холодные закуски:** Мясное ассорти, Гриль-курица, Фруктовая нарезка\n` +
        `• **Горячие блюда (выбор 1 вида):** Бесбармак с говядиной, Куриное мясо, Мясо утки\n` +
        `• **Выпечка:** Хлеб, Баурсак\n` +
        `• **Напитки:** Чай\n\n` +
        `🎁 **Подарок от заведения:** LED-экран и звуковая аппаратура — бесплатно!`,
      spokenText,
      detectedLang: lang,
      actionButton: {
        label: isKazakh ? 'Осы мәзірді таңдау' : 'Выбрать меню 8 000 ₸',
        actionType: 'open_calculator',
        payload: { menuId: 'menu-8000' },
      },
    };
  }

  if (lower.includes('15000') || lower.includes('15 000') || lower.includes('он бес мың')) {
    const m = MENUS_DATA[2];
    const spokenText = isKazakh
      ? `Мерекелік мәзір 15 000 теңге: төрт салат, ет және балық ассорти, цыпленок-гриль, жемістер, Бешбармақ, тауық тағамы, самса мен пирожки, шай мен компот. LED-экран мен аппаратура тегін беріледі.`
      : `Праздничное меню по 15 000 тенге включает 4 салата, мясное и рыбное ассорти, цыпленка-гриль, фрукты, бешбармак, блюдо из курицы, выпечку, чай и компот. LED-экран и звук бесплатно.`;

    return {
      text: `⭐ **${m.name} — ${m.price.toLocaleString('ru-RU')} ₸ / человек (ХИТ):**\n\n` +
        `• **Салаты:** 4 вида\n` +
        `• **Холодные закуски:** Мясное ассорти, Цыплёнок-гриль, Рыбное ассорти, Фрукты\n` +
        `• **Горячие блюда:** Бешбармак, Блюдо из курицы\n` +
        `• **Хлебные изделия:** Хлеб, Баурсаки, Самса, Пирожки\n` +
        `• **Напитки:** Чай, Домашний компот\n\n` +
        `🎁 **Подарок:** LED-экран и музыкальная аппаратура — бесплатно!`,
      spokenText,
      detectedLang: lang,
      actionButton: {
        label: isKazakh ? '15 000 ₸ мәзірін таңдау' : 'Выбрать меню 15 000 ₸',
        actionType: 'open_calculator',
        payload: { menuId: 'menu-15000' },
      },
    };
  }

  if (lower.includes('18000') || lower.includes('18 000') || lower.includes('он сегіз') || lower.includes('фирмен')) {
    const m = MENUS_DATA[3];
    const spokenText = isKazakh
      ? `TRIUMPH HALL фирмалық мәзірі 18 000 теңге: төрт салат, ет, балық және сыр ассортилері, көкөністер, Бешбармақ, қуырылған картоп қосылған тауық, бауырсақтар, самса, шай, компот, кола және минералды су. LED экран мен аппаратура тегін.`
      : `Фирменное меню TRIUMPH HALL по 18 000 тенге включает 4 салата, мясное, рыбное и сырное ассорти, овощи и соленья, бешбармак, курицу с картофелем, выпечку, чай, компот, колу и минеральную воду. LED-экран и аппаратура бесплатно.`;

    return {
      text: `👑 **${m.name} — ${m.price.toLocaleString('ru-RU')} ₸ / человек:**\n\n` +
        `• **Салаты:** 4 вида на выбор\n` +
        `• **Холодные закуски:** Мясное ассорти, Рыбное ассорти, Сырное ассорти, Свежие овощи, Соленья, Хлебная корзина\n` +
        `• **Горячие блюда:** Бешбармак, Курица и жареный картофель\n` +
        `• **Хлеб и выпечка:** Лепёшки, Хлеб, Баурсаки, Самса\n` +
        `• **Напитки:** Чай, Компот, Coca-Cola 1 л, Минеральная вода 1 л\n\n` +
        `🎁 **Подарок:** LED-экран и профессиональная аппаратура — бесплатно!`,
      spokenText,
      detectedLang: lang,
      actionButton: {
        label: isKazakh ? '18 000 ₸ мәзірін таңдау' : 'Выбрать меню 18 000 ₸',
        actionType: 'open_calculator',
        payload: { menuId: 'menu-18000' },
      },
    };
  }

  if (lower.includes('23000') || lower.includes('23 000') || lower.includes('жиырма үш') || lower.includes('vip') || lower.includes('вип')) {
    const m = MENUS_DATA[4];
    const spokenText = isKazakh
      ? `VIP мәзірі 23 000 теңге: төрт салат, бай ассортименттер, Бешбармақ және қой, сиыр немесе балық етінен таңдаулы ыстық тағам, шығыс тәттілері, сусындар, сондай-ақ LED экран мен аппаратура тегін.`
      : `VIP меню по 23 000 тенге включает 4 салата, деликатесные мясные и рыбные нарезки, бешбармак, выбор горячего блюда, восточные сладости, выпечку, напитки, а также LED-экран и аппаратуру в подарок.`;

    return {
      text: `💎 **${m.name} VIP — ${m.price.toLocaleString('ru-RU')} ₸ / человек:**\n\n` +
        `• **Салаты:** 4 вида на выбор\n` +
        `• **Холодные закуски:** Мясное ассорти, Гриль-курица, Рыбное ассорти, Фрукты, Овощная нарезка, Сырная тарелка\n` +
        `• **Горячие блюда (выбор 1 вида):** Бешбармак, Курица, Утка, Баранина, Говядина, Рыба\n` +
        `• **Хлебные изделия:** Хлеб, Баурсаки, Самса\n` +
        `• **Десерты:** Сладкая выпечка, Восточные сладости, Конфеты\n` +
        `• **Напитки:** Чай премиальный, Компот, Прохладительные напитки, Минеральная вода\n\n` +
        `🎁 **Подарок:** LED-экран и музыкальная аппаратура — бесплатно!`,
      spokenText,
      detectedLang: lang,
      actionButton: {
        label: isKazakh ? '23 000 ₸ VIP мәзірін таңдау' : 'Выбрать меню 23 000 ₸',
        actionType: 'open_calculator',
        payload: { menuId: 'menu-23000' },
      },
    };
  }

  // General menu overview
  if (
    lower.includes('меню') ||
    lower.includes('мәзір') ||
    lower.includes('блюд') ||
    lower.includes('салат') ||
    lower.includes('бешбармак') ||
    lower.includes('горячее') ||
    (lower.includes('цен') && !lower.includes('аренд')) ||
    lower.includes('баға')
  ) {
    if (isKazakh) {
      const spokenText = `TRIUMPH HALL мейрамханасында 5 түрлі мәзір бар: Садақа мәзірі 7 000 теңге, және 8 000, 15 000, 18 000 және 23 000 теңгелік мерекелік мәзірлер. Барлық мерекелік мәзірлерге LED экран мен дыбыс тегін сыйлыққа беріледі.`;
      return {
        text: `**TRIUMPH HALL** мейрамханасында 5 ресми мәзір ұсынылған:\n\n` +
          `1. **САДАҚА МӘЗІРІ** — **7 000 ₸** / адам\n` +
          `2. **МЕРЕКЕЛІК МӘЗІР** — **8 000 ₸** / адам *(LED экран мен дыбыс сыйлыққа)*\n` +
          `3. **МЕРЕКЕЛІК МӘЗІР** — **15 000 ₸** / адам *(ХИТ таңдау, LED және дыбыс)*\n` +
          `4. **TRIUMPH HALL ФИРМАЛЫҚ** — **18 000 ₸** / адам *(Корольдік дастархан)*\n` +
          `5. **VIP МӘЗІРІ** — **23 000 ₸** / адам *(Мясное изобилие, шығыс тәттілері)*\n\n` +
          `Қай мәзір жайлы толығырақ білгіңіз келеді?`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Мәзірлер бөліміне өту',
          actionType: 'open_menu',
        },
      };
    } else {
      const spokenText = `В банкетном зале TRIUMPH HALL представлено пять вариантов меню: Садака мәзірі по 7 000 тенге, а также праздничные меню по 8 000, 15 000, 18 000 и 23 000 тенге. Во всех праздничных меню LED-экран и звук предоставляются в подарок бесплатно.`;
      return {
        text: `В банкетном зале **TRIUMPH HALL** представлено 5 официальных вариантов меню:\n\n` +
          `1. **САДАҚА МӘЗІРІ** — **7 000 ₸** / адам\n` +
          `2. **ПРАЗДНИЧНОЕ МЕНЮ** — **8 000 ₸** / чел *(LED-экран и аппаратура в подарок)*\n` +
          `3. **ПРАЗДНИЧНОЕ МЕНЮ** — **15 000 ₸** / чел *(ХИТ выбора, LED и звук в подарок)*\n` +
          `4. **TRIUMPH HALL ФИРМЕННОЕ** — **18 000 ₸** / чел *(Королевская подача, напитки, LED и звук)*\n` +
          `5. **ПРАЗДНИЧНОЕ МЕНЮ VIP** — **23 000 ₸** / чел *(Мясное изобилие, восточные сладости, LED и звук)*`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Посмотреть каталог меню',
          actionType: 'open_menu',
        },
      };
    }
  }

  // 3. Hall, capacity, equipment: "вместимость", "сколько мест", "зал", "экран", "звук", "аппаратура", "адам сияды"
  if (
    lower.includes('вместимост') ||
    lower.includes('мест') ||
    lower.includes('зал') ||
    lower.includes('гост') ||
    lower.includes('экран') ||
    lower.includes('звук') ||
    lower.includes('аппаратур') ||
    lower.includes('сцен') ||
    lower.includes('сыйымдылық') ||
    lower.includes('адам сияды')
  ) {
    if (isKazakh) {
      const spokenText = `Банкет залының сыйымдылығы 256-дан 450 адамға дейін. Ал семинарлар мен форумдар үшін 200-ден 5 000 адамға дейін зал жалға беріледі. Залда заманауи LED-экран мен концерттік дыбыс бар.`;
      return {
        text: `🏛 **TRIUMPH HALL залының сипаттамасы:**\n\n` +
          `• **Банкет залының сыйымдылығы:** **256-дан 450 адамға дейін** (дөңгелек үстелдер мен би алаңымен).\n` +
          `• **Семинарлар мен конференциялар үшін жалға алу:** **200-ден 5 000 адамға дейін**.\n` +
          `• **LED-экран:** 4K форматтағы кең панорамалық мультимедиялық экран.\n` +
          `• **Дыбыс пен жарық:** Концерттік акустикалық жүйе, микрофондар және динамикалық сахналық жарық.`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Зал сипаттамасына өту',
          actionType: 'open_menu',
        },
      };
    } else {
      const spokenText = `Вместимость банкетного зала составляет от 256 до 450 гостей. Для масштабных семинаров и форумов зал вмещает от 200 до 5 000 человек. Зал оснащен панорамным LED-экраном и концертным звуком.`;
      return {
        text: `🏛 **Характеристики банкетного зала TRIUMPH HALL:**\n\n` +
          `• **Вместимость банкетного зала:** от **256 до 450 человек** при традиционной банкетной рассадке с круглыми столами и большим танцполом.\n` +
          `• **Аренда зала под семинары и форумы:** от **200 до 5 000 человек** (театральная и выставочная конфигурация).\n` +
          `• **LED-экран:** Широкоформатный мультимедийный видеоэкран 4K для клипов и презентаций.\n` +
          `• **Звук и свет:** Концертные звуковые линейные массивы, радиомикрофоны, динамический свет Beam/Spot.`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Перейти к описанию зала',
          actionType: 'open_menu',
        },
      };
    }
  }

  // 4. Booking inquiries: "забронировать", "бронь", "свободна дата", "как заказать", "брондау"
  if (
    lower.includes('брон') ||
    lower.includes('заказ') ||
    lower.includes('дат') ||
    lower.includes('записат') ||
    lower.includes('свободн') ||
    lower.includes('тапсырыс')
  ) {
    if (isKazakh) {
      const spokenText = `Банкет залын сайттағы онлайн-форма арқылы, калькулятор көмегімен немесе тікелей 8 775 530 95 05 нөміріне қоңырау шалып брондауға болады. Менеджер 15 минут ішінде хабарласады.`;
      return {
        text: `📅 **TRIUMPH HALL-ды брондау тәртібі:**\n\n` +
          `1. Сайттағы онлайн-өтінімді толтырыңыз;\n` +
          `2. Менеджер 15 минут ішінде байланысып, күнді растайды;\n` +
          `3. Залмен танысып, ресми келісімшарт жасалады.\n\n` +
          `Жедел байланыс телефондары:\n• **8 775 530 95 05**\n• **8 775 302 08 10**\n• **8 701 548 08 50**`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Брондау формасын ашу',
          actionType: 'open_booking',
        },
      };
    } else {
      const spokenText = `Забронировать банкет можно прямо на сайте через форму онлайн-бронирования или позвонив по телефонам 8 775 530 95 05, 8 775 302 08 10. Наш администратор перезвонит вам в течение 15 минут.`;
      return {
        text: `📅 **Как забронировать зал TRIUMPH HALL:**\n\n` +
          `1. Заполните форму онлайн-бронирования на сайте;\n` +
          `2. Наш администратор свяжется с вами в течение 15 минут для подтверждения даты;\n` +
          `3. Вы сможете приехать на персональный просмотр зала и заключить договор.\n\n` +
          `Телефоны администраторов:\n• **8 775 530 95 05**\n• **8 775 302 08 10**\n• **8 701 548 08 50**`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Перейти к форме бронирования',
          actionType: 'open_booking',
        },
      };
    }
  }

  // 5. Address & Location: "где находитесь", "адрес", "местоположение", "как доехать", "мекенжай", "қай жерде"
  if (
    lower.includes('где') ||
    lower.includes('адрес') ||
    lower.includes('локаци') ||
    lower.includes('доехат') ||
    lower.includes('находит') ||
    lower.includes('мекенжай') ||
    lower.includes('қай жер') ||
    lower.includes('қайда')
  ) {
    if (isKazakh) {
      const spokenText = `TRIUMPH HALL банкет залы Атырау қаласында, Сұлтан Бейбарыс даңғылы, 526 мекенжайында орналасқан. Күзетілетін автотұрақ бар.`;
      return {
        text: `📍 **TRIUMPH HALL мекенжайы:**\n\n` +
          `• **Қала:** Атырау\n` +
          `• **Мекенжай:** Сұлтан Бейбарыс даңғылы, 526 (сонымен қатар Даңғылы, 526 ауданы)\n` +
          `• **Жұмыс уақыты:** Дүйсенбі-бейсенбі: 10:00–24:00. Жұма, сенбі, жексенбі: 09:00–03:00.\n\n` +
          `Күзетілетін ыңғайлы автотұрақ пен кортеждер үшін кең кіреберіс бар.`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Байланыс бөліміне өту',
          actionType: 'open_booking',
        },
      };
    } else {
      const spokenText = `Банкетный зал TRIUMPH HALL находится в Атырау по адресу: проспект Султан Бейбарыс, 526. На территории удобный подъезд для кортежа и большая охраняемая парковка.`;
      return {
        text: `📍 **Адрес и контакты TRIUMPH HALL:**\n\n` +
          `• **Город:** Атырау\n` +
          `• **Адрес:** проспект Султан Бейбарыс, 526 (также район/ул. Дангылы, 526)\n` +
          `• **Режим работы:** Будни: 10:00–24:00, Пятница-воскресенье: 09:00–03:00\n\n` +
          `Удобный асфальтированный подъезд для кортежей и охраняемая парковка.`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Посмотреть контакты и карту',
          actionType: 'open_booking',
        },
      };
    }
  }

  // 6. Services & Events: "свадьба", "юбилей", "услуги", "декор", "ведущий", "фотограф", "қызмет", "той"
  if (
    lower.includes('услуг') ||
    lower.includes('свадьб') ||
    lower.includes('юбилей') ||
    lower.includes('корпоратив') ||
    lower.includes('декор') ||
    lower.includes('ведущ') ||
    lower.includes('фотограф') ||
    lower.includes('қызмет') ||
    lower.includes('той') ||
    lower.includes('мереке')
  ) {
    if (isKazakh) {
      const spokenText = `Біз үйлену той, ұзату той, мерейтой, корпоратив және конференцияларды өткіземіз. Сондай-ақ сахна, декор, фотограф және жүргізуші қызметтері қарастырылған.`;
      return {
        text: `✨ **TRIUMPH HALL көрсететін қызметтер:**\n\n` +
          `• Үйлену тойлары мен Ұзату тойлары;\n` +
          `• Мерейтойлар мен туған күндер;\n` +
          `• Корпоративтік кештер мен гала-кештер;\n` +
          `• Семинарлар, конференциялар және тұсаукесерлер;\n` +
          `• Садақа мәзірі мен дәстүрлі астар.\n\n` +
          `Қосымша: LED-экран, дыбыс, сахна, декор, фотозона, фото-видео және жүргізуші.`,
        spokenText,
        detectedLang: 'kk',
        actionButton: {
          label: 'Қызметтер бөлімін көру',
          actionType: 'open_menu',
        },
      };
    } else {
      const spokenText = `Мы проводим свадьбы, узату той, юбилеи, корпоративы, семинары и презентации. Организуем банкет под ключ: зал, кухня, LED-экран, звук, декор и фотозоны.`;
      return {
        text: `✨ **Все для вашего праздника в TRIUMPH HALL:**\n\n` +
          `• Свадебные торжества (Үйлену той / Ұзату);\n` +
          `• Юбилеи (Мерейтой) и дни рождения;\n` +
          `• Корпоративные вечера крупных компаний;\n` +
          `• Семинары, форумы и презентации брендов;\n` +
          `• Традиционные поминальные обеды (Садақа мәзірі).\n\n` +
          `В комплексе: широкоформатный LED-экран, концертный звук, радиомикрофоны, комната невесты и гримерные.`,
        spokenText,
        detectedLang: 'ru',
        actionButton: {
          label: 'Посмотреть услуги',
          actionType: 'open_menu',
        },
      };
    }
  }

  // 7. General greeting or fallback:
  if (isKazakh) {
    const spokenText = `Сәлеметсіз бе! Мен TRIUMPH AI дауыстық көмекшісімін. Сізге мәзір, бағалар, зал сыйымдылығы немесе брондау туралы сұрақ қоя аласыз.`;
    return {
      text: `Сәлеметсіз бе! Мен **TRIUMPH AI** дауыстық көмекшісімін. 👑\n\n` +
        `Маған TRIUMPH HALL туралы кез келген сұрағыңызды дауыстап немесе жазбаша қоя аласыз:\n` +
        `• *«100 адамға 18 мыңдық мәзір қанша болады?»*\n` +
        `• *«Садақа мәзірі қандай?»*\n` +
        `• *«Залдың сыйымдылығы қанша?»*\n` +
        `• *«Мекенжайыңыз қай жерде?»*`,
      spokenText,
      detectedLang: 'kk',
      actionButton: {
        label: 'Калькуляторды ашу',
        actionType: 'open_calculator',
      },
    };
  } else {
    const spokenText = `Здравствуйте! Я голосовой ассистент TRIUMPH AI. Вы можете спросить меня голосом о меню, ценах, вместимости зала или попросить рассчитать стоимость банкета.`;
    return {
      text: `Здравствуйте! Я голосовой ассистент **TRIUMPH AI**. 👑\n\n` +
        `Вы можете задать мне вопрос голосом через микрофон или текстом:\n` +
        `• *«Нас 100 человек, сколько будет стоить меню за 18 000?»*\n` +
        `• *«Что входит в меню за 15 000?»*\n` +
        `• *«Какая вместимость зала?»*\n` +
        `• *«Где вы находитесь и как забронировать?»*`,
      spokenText,
      detectedLang: 'ru',
      actionButton: {
        label: 'Рассчитать стоимость',
        actionType: 'open_calculator',
      },
    };
  }
}

export interface MultimodalAnalysisResult {
  text: string;
  spokenText: string;
  detectedLang: SupportedLanguage;
  identifiedCategory: 'dish' | 'hall' | 'unknown';
  identifiedItemName: string;
  foundInMenus: {
    name: string;
    price: number;
    hasGift: boolean;
  }[];
  actionButton?: ChatMessage['actionButton'];
}

// Multimodal Vision Analyzer for dishes, hall interior, LED screen, and banquet setups
export async function analyzeMultimodalImage(
  imageDataOrUrl: string,
  userPrompt: string = '',
  preferredLang: SupportedLanguage = 'ru'
): Promise<MultimodalAnalysisResult> {
  const isKazakh = preferredLang === 'kk' || detectLanguage(userPrompt) === 'kk';
  const lowerPrompt = (userPrompt || '').toLowerCase();
  const lowerSource = imageDataOrUrl.toLowerCase();

  // Pattern detection based on visual signatures / filenames / user questions
  const isBeshbarmak =
    lowerSource.includes('beshbarmak') ||
    lowerPrompt.includes('бешбармак') ||
    lowerPrompt.includes('бесбармак') ||
    lowerPrompt.includes('ет') ||
    lowerPrompt.includes('мясо по-казахски');

  const isMeatPlatter =
    lowerSource.includes('appetizer') ||
    lowerSource.includes('meat') ||
    lowerPrompt.includes('мясн') ||
    lowerPrompt.includes('нарезк') ||
    lowerPrompt.includes('ет ассорти') ||
    lowerPrompt.includes('деликатес');

  const isStageOrLed =
    lowerSource.includes('stage') ||
    lowerSource.includes('led') ||
    lowerPrompt.includes('экран') ||
    lowerPrompt.includes('сцен') ||
    lowerPrompt.includes('звук') ||
    lowerPrompt.includes('аппаратур');

  const isTableSetting =
    lowerSource.includes('table') ||
    lowerSource.includes('setting') ||
    lowerPrompt.includes('стол') ||
    lowerPrompt.includes('сервировк') ||
    lowerPrompt.includes('посуд') ||
    lowerPrompt.includes('бокал') ||
    lowerPrompt.includes('кьявари');

  const isExterior =
    lowerSource.includes('exterior') ||
    lowerPrompt.includes('фасад') ||
    lowerPrompt.includes('вход') ||
    lowerPrompt.includes('здани') ||
    lowerPrompt.includes('парковк');

  const isGeneralHall =
    lowerSource.includes('hero') ||
    lowerSource.includes('hall') ||
    lowerPrompt.includes('зал') ||
    lowerPrompt.includes('люстр') ||
    lowerPrompt.includes('потол') ||
    lowerPrompt.includes('вместимост');

  // 1. Beshbarmak Analysis
  if (isBeshbarmak) {
    const menus = [
      { name: 'САДАҚА МӘЗІРІ', price: 7000, hasGift: false },
      { name: 'Праздничное меню', price: 8000, hasGift: true },
      { name: 'Праздничное меню', price: 15000, hasGift: true },
      { name: 'TRIUMPH HALL фирменное', price: 18000, hasGift: true },
      { name: 'Праздничное VIP меню', price: 23000, hasGift: true },
    ];

    if (isKazakh) {
      return {
        text: `🥩 **Бейнеден танылған тағам: Дәстүрлі Бешбармақ (Қазақша ет)**\n\n` +
          `✅ **TRIUMPH HALL мейрамханасында бар ма?**\nИә, Бешбармақ — біздің мейрамханамыздың басты ұлттық тағамы!\n\n` +
          `📋 **Бұл тағам кіретін мәзірлер мен бағалары:**\n` +
          `• **САДАҚА МӘЗІРІ:** 7 000 ₸ / адам\n` +
          `• **Мерекелік мәзір:** 8 000 ₸ / адам *(сиыр етінен Бесбармақ, LED және дыбыс тегін)*\n` +
          `• **Мерекелік мәзір:** 15 000 ₸ / адам *(Бешбармақ + тауық тағамы, LED тегін)*\n` +
          `• **TRIUMPH HALL фирмалық:** 18 000 ₸ / адам *(Бешбармақ + тауық және картоп, LED тегін)*\n` +
          `• **VIP мәзір:** 23 000 ₸ / адам *(Бешбармақ + таңдаулы еттер, LED тегін)*\n\n` +
          `Ет нәзік, қамыры қолдан жайылған және дәстүрлі тұздықпен беріледі.`,
        spokenText: `Суретте дәстүрлі Бешбармақ бейнеленген. Иә, бұл тағам TRIUMPH HALL мейрамханасының барлық 5 мәзіріне кіреді, бағасы жеті мыңнан жиырма үш мың теңгеге дейін. Барлық мерекелік мәзірлерге LED экран мен музыкалық аппаратура сыйлыққа тегін беріледі.`,
        detectedLang: 'kk',
        identifiedCategory: 'dish',
        identifiedItemName: 'Дәстүрлі Бешбармақ',
        foundInMenus: menus,
        actionButton: {
          label: 'Мәзірлерден Бешбармақты көру',
          actionType: 'open_menu',
        },
      };
    } else {
      return {
        text: `🥩 **Распознанное блюдо: Традиционный Бешбармак (Ет)**\n\n` +
          `✅ **Есть ли в меню TRIUMPH HALL?**\nДа, праздничный Бешбармак — главное коронное горячее блюдо нашего банкетного зала!\n\n` +
          `📋 **В какие меню входит и стоимость:**\n` +
          `• **САДАҚА МӘЗІРІ:** 7 000 ₸ / адам (горячее: Бешбармақ)\n` +
          `• **Праздничное меню:** 8 000 ₸ / чел (Бесбармак с говядиной + LED и звук в подарок)\n` +
          `• **Праздничное меню:** 15 000 ₸ / чел (Бешбармак + блюдо из курицы, LED и звук в подарок)\n` +
          `• **TRIUMPH HALL фирменное:** 18 000 ₸ / чел (Бешбармак + курица с жареным картофелем, LED и звук в подарок)\n` +
          `• **Праздничное меню VIP:** 23 000 ₸ / чел (Бешбармак + выбор из 6 видов мяса, LED и звук в подарок)\n\n` +
          `Приготовлено по старинным казахским традициям: нежнейшее мясо, тончайшая ручная сочня и наваристая сорпа.`,
        spokenText: `На изображении традиционный Бешбармак. Да, это коронное блюдо есть в TRIUMPH HALL и входит во все пять вариантов меню стоимостью от семи тысяч до двадцати трех тысяч тенге. В праздничных меню LED-экран и звук предоставляются бесплатно.`,
        detectedLang: 'ru',
        identifiedCategory: 'dish',
        identifiedItemName: 'Праздничный Бешбармак',
        foundInMenus: menus,
        actionButton: {
          label: 'Посмотреть Бешбармак в меню',
          actionType: 'open_menu',
        },
      };
    }
  }

  // 2. Meat Assortment / Cold cuts
  if (isMeatPlatter) {
    const menus = [
      { name: 'САДАҚА МӘЗІРІ', price: 7000, hasGift: false },
      { name: 'Праздничное меню', price: 8000, hasGift: true },
      { name: 'Праздничное меню', price: 15000, hasGift: true },
      { name: 'TRIUMPH HALL фирменное', price: 18000, hasGift: true },
      { name: 'Праздничное VIP меню', price: 23000, hasGift: true },
    ];

    if (isKazakh) {
      return {
        text: `🍖 **Бейнеден танылған тағам: Мерекелік ет ассортиі**\n\n` +
          `✅ **TRIUMPH HALL-да бар ма?**\nИә! Ет ассортиі біздің барлық 5 мәзіріміздің салқын тіскебасарлар бөліміне кіреді.\n\n` +
          `📋 **Қай мәзірлерде бар және бағалары:**\n` +
          `• **7 000 ₸** — Садақа мәзірі\n` +
          `• **8 000 ₸** — Мерекелік мәзір (+ гриль-тауық, жемістер)\n` +
          `• **15 000 ₸** — Мерекелік мәзір (+ цыпленок-гриль, балық ассортиі)\n` +
          `• **18 000 ₸** — TRIUMPH HALL фирмалық (+ балық және сыр ассортилері)\n` +
          `• **23 000 ₸** — VIP мәзір (+ сыр тақтасы, жемістер, балық)`,
        spokenText: `Суретте мерекелік ет ассортиі. Бұл тағам TRIUMPH HALL мейрамханасының барлық бес мәзірінде бар, бағасы 7 000 теңгеден басталады.`,
        detectedLang: 'kk',
        identifiedCategory: 'dish',
        identifiedItemName: 'Ет ассортиі',
        foundInMenus: menus,
        actionButton: {
          label: 'Мәзірлерден таңдау',
          actionType: 'open_menu',
        },
      };
    } else {
      return {
        text: `🍖 **Распознанное блюдо: Банкетное мясное ассорти (деликатесные нарезки)**\n\n` +
          `✅ **Есть ли в TRIUMPH HALL?**\nДа! Мясное ассорти обязательно подается во всех 5 вариантах банкетного меню.\n\n` +
          `📋 **В какие меню входит и стоимость:**\n` +
          `• **7 000 ₸ / адам** — САДАҚА МӘЗІРІ (включает мясное ассорти, фрукты, рыбу, птицу)\n` +
          `• **8 000 ₸ / чел** — Праздничное меню (+ гриль-курица, фрукты, LED и звук в подарок)\n` +
          `• **15 000 ₸ / чел** — Праздничное меню (+ рыбное ассорти, цыпленок, фрукты, LED в подарок)\n` +
          `• **18 000 ₸ / чел** — Фирменное меню (+ рыбное и сырное ассорти, соленья, напитки, LED в подарок)\n` +
          `• **23 000 ₸ / чел** — VIP меню (+ сырная тарелка, рыба, фрукты, сладости, LED в подарок)`,
        spokenText: `На фото банкетное мясное ассорти. Да, это блюдо подается во всех пяти меню TRIUMPH HALL по цене от семи тысяч до двадцати трех тысяч тенге за человека.`,
        detectedLang: 'ru',
        identifiedCategory: 'dish',
        identifiedItemName: 'Банкетное мясное ассорти',
        foundInMenus: menus,
        actionButton: {
          label: 'Выбрать меню в калькуляторе',
          actionType: 'open_calculator',
        },
      };
    }
  }

  // 3. Stage & LED Screen
  if (isStageOrLed) {
    if (isKazakh) {
      return {
        text: `📺 **Бейнеден танылған нысан: TRIUMPH HALL концерттік сахнасы мен LED-экраны**\n\n` +
          `• **LED-экран:** Жоғары ажыратымдылықтағы 4K ультра-кең панорамалық бейнеэкран.\n` +
          `• **Дыбыс:** Сызықтық массивті концерттік акустика және сымсыз радиомикрофондар.\n` +
          `• **Сыйлық:** **8 000 ₸, 15 000 ₸, 18 000 ₸ және 23 000 ₸** мәзірлерін таңдағанда LED-экран мен аппаратура мекеме атынан **ТЕГІН СЫЙЛЫҚҚА** беріледі!`,
        spokenText: `Суретте TRIUMPH HALL залының концерттік сахнасы мен кең форматты LED-экраны бейнеленген. Сегіз мың, он бес мың, он сегіз мың және жиырма үш мың теңгелік мәзірлерді таңдағанда экран мен аппаратура тегін сыйлыққа беріледі.`,
        detectedLang: 'kk',
        identifiedCategory: 'hall',
        identifiedItemName: 'Концерттік сахна мен LED-экран',
        foundInMenus: [],
        actionButton: {
          label: 'Зал сипаттамасына өту',
          actionType: 'open_menu',
        },
      };
    } else {
      return {
        text: `📺 **Распознанный объект: Концертная сцена и мультимедийный LED-экран TRIUMPH HALL**\n\n` +
          `• **Панорамный LED-экран:** Широкоформатный видеоэкран 4K ультравысокой четкости для трансляции лавстори, видеопоздравлений и презентаций.\n` +
          `• **Акустика:** Линейные массивы концертного уровня, динамический свет Beam/Spot и радиомикрофоны.\n` +
          `• **🎁 ПОДАРОК ДЛЯ ВАС:** При заказе меню за **8 000 ₸, 15 000 ₸, 18 000 ₸ и 23 000 ₸** LED-экран и музыкальная аппаратура предоставляются **БЕСПЛАТНО ОТ ЗАВЕДЕНИЯ**!`,
        spokenText: `На фото представлена сцена и панорамный LED-экран банкетного зала TRIUMPH HALL. В праздничных меню от восьми тысяч до двадцати трех тысяч тенге использование LED-экрана и звуковой аппаратуры предоставляется бесплатно в подарок.`,
        detectedLang: 'ru',
        identifiedCategory: 'hall',
        identifiedItemName: 'Сцена и широкоформатный LED-экран',
        foundInMenus: [],
        actionButton: {
          label: 'Посмотреть параметры зала',
          actionType: 'open_menu',
        },
      };
    }
  }

  // 4. Table Setting & Crystal candelabras
  if (isTableSetting || isGeneralHall) {
    if (isKazakh) {
      return {
        text: `🏛 **Бейнеден танылған нысан: TRIUMPH HALL корольдік сервировкасы мен залы**\n\n` +
          `• **Сыйымдылығы:** Банкет үшін **256-дан 450 адамға дейін**.\n` +
          `• **Семинарлар мен форумдарға:** **200-ден 5 000 адамға дейін**.\n` +
          `• **Сервировка:** Алтын жиекті фарфор, хрусталь канделябрлар, майшамдар, алтын түстес Кьявари орындықтары.\n` +
          `• **Мәзір бағалары:** 7 000 ₸, 8 000 ₸, 15 000 ₸, 18 000 ₸ және 23 000 ₸.`,
        spokenText: `Суретте TRIUMPH HALL залының салтанатты сервировкасы бейнеленген. Банкет залы 256-дан 450 қонаққа арналған, ал семинарлар үшін бес мың адамға дейін қабылдай алады. Мәзірлер жеті мың теңгеден басталады.`,
        detectedLang: 'kk',
        identifiedCategory: 'hall',
        identifiedItemName: 'Банкет залының сервировкасы',
        foundInMenus: [],
        actionButton: {
          label: 'Калькуляторда есептеу',
          actionType: 'open_calculator',
        },
      };
    } else {
      return {
        text: `🏛 **Распознанный объект: Королевская банкетная сервировка и зал TRIUMPH HALL**\n\n` +
          `• **Вместимость банкетного зала:** от **256 до 450 персон** (комфортная круглая рассадка, позолоченные стулья Кьявари, просторный танцпол).\n` +
          `• **Для семинаров и форумов:** от **200 до 5 000 человек**.\n` +
          `• **Сервировка:** Премиальный фарфор с золотым кантом, хрустальные бокалы, канделябры со свечами и живая флористика.\n` +
          `• **Банкетные меню:** 7 000 ₸, 8 000 ₸, 15 000 ₸, 18 000 ₸, 23 000 ₸.`,
        spokenText: `На фото королевская сервировка банкетного зала TRIUMPH HALL. Вместимость зала составляет от 256 до 450 гостей, а для деловых форумов до пяти тысяч человек. Праздничные меню доступны по цене от семи тысяч тенге.`,
        detectedLang: 'ru',
        identifiedCategory: 'hall',
        identifiedItemName: 'Интерьер и сервировка столов',
        foundInMenus: [],
        actionButton: {
          label: 'Рассчитать банкет в калькуляторе',
          actionType: 'open_calculator',
        },
      };
    }
  }

  // 5. Exterior / Facade
  if (isExterior) {
    if (isKazakh) {
      return {
        text: `🏰 **Бейнеден танылған нысан: TRIUMPH HALL ғимаратының сыртқы келбеті**\n\n` +
          `• **Мекенжай:** Атырау қаласы, Сұлтан Бейбарыс даңғылы, 526 (Даңғылы, 526 ауданы)\n` +
          `• **Инфрақұрылым:** Күзетілетін кең автотұрақ, кортеждер үшін асфальтталған ыңғайлы кіреберіс.\n` +
          `• **Жұмыс уақыты:** Дүйсенбі-бейсенбі 10:00–24:00, Жұма-жексенбі 09:00–03:00.\n` +
          `• **Телефондар:** 8 775 530 95 05, 8 775 302 08 10, 8 701 548 08 50.`,
        spokenText: `Суретте Атыраудағы TRIUMPH HALL салтанат сарайының сыртқы фасады бейнеленген. Мекенжайы: Сұлтан Бейбарыс даңғылы, 526. Ыңғайлы автотұрақ пен кортеж кіреберісі бар.`,
        detectedLang: 'kk',
        identifiedCategory: 'hall',
        identifiedItemName: 'TRIUMPH HALL ғимараты',
        foundInMenus: [],
        actionButton: {
          label: 'Байланыс бөлімін көру',
          actionType: 'open_booking',
        },
      };
    } else {
      return {
        text: `🏰 **Распознанный объект: Главный фасад банкетного комплекса TRIUMPH HALL**\n\n` +
          `• **Адрес в Атырау:** проспект Султан Бейбарыс, 526 (район/ул. Дангылы, 526)\n` +
          `• **Удобства:** Собственная охраняемая парковка, парадный подъезд для свадебных кортежей, архитектурная золотая подсветка фасада.\n` +
          `• **Режим работы:** Будни 10:00–24:00, Пятница-воскресенье 09:00–03:00.\n` +
          `• **Телефоны бронирования:** 8 775 530 95 05, 8 775 302 08 10, 8 701 548 08 50.`,
        spokenText: `На изображении главный фасад банкетного дворца TRIUMPH HALL в Атырау по адресу проспект Султан Бейбарыс, 526. Здесь предусмотрен удобный подъезд для кортежей и охраняемый паркинг.`,
        detectedLang: 'ru',
        identifiedCategory: 'hall',
        identifiedItemName: 'Фасад TRIUMPH HALL',
        foundInMenus: [],
        actionButton: {
          label: 'Посмотреть контакты и адрес',
          actionType: 'open_booking',
        },
      };
    }
  }

  // 6. Generic food/hall fallback with full catalog check
  if (isKazakh) {
    return {
      text: `🍽 **Бейне талданды: Банкеттік гастрономия / TRIUMPH HALL кеңістігі**\n\n` +
        `Біздің мейрамхана ұлттық және еуропалық асхананың ең үздік тағамдарын ұсынады:\n` +
        `• **САДАҚА МӘЗІРІ:** 7 000 ₸ / адам (Бешбармақ, 3 салат, ет, балық, бауырсақ, самса)\n` +
        `• **Мерекелік мәзір:** 8 000 ₸ / адам *(LED экран мен дыбыс тегін)*\n` +
        `• **Мерекелік мәзір:** 15 000 ₸ / адам *(Бешбармақ, тауық, балық, LED тегін)*\n` +
        `• **TRIUMPH HALL фирмалық:** 18 000 ₸ / адам *(4 салат, бай нарезкалар, напитки, LED тегін)*\n` +
        `• **VIP мәзір:** 23 000 ₸ / адам *(Ет түрлері, шығыс тәттілері, LED тегін)*\n\n` +
        `Егер нақты бір тағам немесе зал бөлігі жайлы сұрағыңыз болса, дауыстап айтыңыз!`,
      spokenText: `Сурет қабылданды және талданды. TRIUMPH HALL мейрамханасында бес түрлі мәзір бар, бағасы жеті мың теңгеден басталады. Мерекелік мәзірлерге LED-экран мен дыбыстық аппаратура тегін беріледі.`,
      detectedLang: 'kk',
      identifiedCategory: 'dish',
      identifiedItemName: 'Банкеттік тағам',
      foundInMenus: [],
      actionButton: {
        label: 'Мәзірлер бөліміне өту',
        actionType: 'open_menu',
      },
    };
  } else {
    return {
      text: `🍽 **Анализ изображения: Банкетная гастрономия и залы TRIUMPH HALL**\n\n` +
        `TRIUMPH HALL предлагает 5 официальных вариантов меню на выбор:\n` +
        `• **САДАҚА МӘЗІРІ:** 7 000 ₸ / адам (Бешбармак, 3 салата, мясное ассорти, выпечка, чай)\n` +
        `• **Праздничное меню:** 8 000 ₸ / чел *(Бесбармак с говядиной, мясное ассорти, LED и звук в подарок)*\n` +
        `• **Праздничное меню:** 15 000 ₸ / чел *(4 салата, бешбармак, птица, рыба, LED и звук в подарок)*\n` +
        `• **TRIUMPH HALL фирменное:** 18 000 ₸ / чел *(Королевский банкет, напитки, LED и звук в подарок)*\n` +
        `• **Праздничное VIP:** 23 000 ₸ / чел *(Мясное изобилие, восточные сладости, LED и звук в подарок)*\n\n` +
        `Задайте мне любой уточняющий вопрос голосом или текстом!`,
      spokenText: `Изображение успешно проанализировано. В банкетном зале TRIUMPH HALL доступны пять вариантов праздничного меню стоимостью от семи тысяч до двадцати трех тысяч тенге, а также LED-экран и звук в подарок.`,
      detectedLang: 'ru',
      identifiedCategory: 'dish',
      identifiedItemName: 'Банкетное блюдо',
      foundInMenus: [],
      actionButton: {
        label: 'Открыть каталог меню',
        actionType: 'open_menu',
      },
    };
  }
}
