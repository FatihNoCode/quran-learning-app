// Single source of truth for all Arabic letters, names, and pronunciations
// This ensures consistency across the entire app

export type LetterType = 'peltek' | 'heavy' | 'throat' | 'normal';

export interface ArabicLetter {
  id: string; // Unique identifier
  arabic: string; // The Arabic character
  name: string; // Universal name (e.g., "Alif")
  pronunciation: {
    tr: string; // Turkish pronunciation
    nl: string; // Dutch pronunciation
  };
  type: LetterType;
  example?: {
    tr: string;
    nl: string;
  };
  specialNote?: {
    tr: string;
    nl: string;
  };
}

// Complete Arabic alphabet - THE SOURCE OF TRUTH
export const ARABIC_LETTERS: Record<string, ArabicLetter> = {
  // Row 1: Alif to Tha
  ALIF: {
    id: 'alif',
    arabic: 'ا',
    name: 'Alif',
    pronunciation: { tr: 'a / e', nl: 'a / e' },
    type: 'normal',
    example: { tr: 'Allah', nl: 'Allah' }
  },
  BA: {
    id: 'ba',
    arabic: 'ب',
    name: 'Bā',
    pronunciation: { tr: 'be', nl: 'be' },
    type: 'normal',
    example: { tr: 'bismillah', nl: 'bismillah' }
  },
  TA: {
    id: 'ta',
    arabic: 'ت',
    name: 'Tā',
    pronunciation: { tr: 'te', nl: 'te' },
    type: 'normal',
    example: { tr: 'tevbe', nl: 'tawba' }
  },
  THA: {
    id: 'tha',
    arabic: 'ث',
    name: 'Thā',
    pronunciation: { tr: 's (peltek)', nl: 's (peltek)' },
    type: 'peltek',
    example: { tr: 'sevap', nl: 'beloning' },
    specialNote: {
      tr: 'Dil dişlerin arasında - İngilizcede "think" gibi',
      nl: 'Tong tussen de tanden - zoals Engels "think"'
    }
  },

  // Row 2: Jim to Kha
  JIM: {
    id: 'jim',
    arabic: 'ج',
    name: 'Cīm',
    pronunciation: { tr: 'cim', nl: 'djiem' },
    type: 'normal',
    example: { tr: 'cennet', nl: 'paradijs' }
  },
  HA: {
    id: 'ha',
    arabic: 'ح',
    name: 'Ḥā',
    pronunciation: { tr: 'ha (boğaz)', nl: 'ha (keel)' },
    type: 'throat',
    example: { tr: 'hacc', nl: 'hadj' },
    specialNote: {
      tr: 'Boğazdan gelen h sesi',
      nl: 'H-klank vanuit de keel'
    }
  },
  KHA: {
    id: 'kha',
    arabic: 'خ',
    name: 'Khā',
    pronunciation: { tr: 'h (boğaz)', nl: 'ch (keel)' },
    type: 'throat',
    example: { tr: 'hayır', nl: 'goed' },
    specialNote: {
      tr: 'Boğazdan gelen güçlü h - Hollandaca "g" gibi',
      nl: 'Sterke h vanuit keel - zoals Nederlandse "g"'
    }
  },

  // Row 3: Dal to Zay
  DAL: {
    id: 'dal',
    arabic: 'د',
    name: 'Dāl',
    pronunciation: { tr: 'de', nl: 'de' },
    type: 'normal',
    example: { tr: 'dua', nl: 'gebed' }
  },
  DHAL: {
    id: 'dhal',
    arabic: 'ذ',
    name: 'Dhāl',
    pronunciation: { tr: 'z (peltek)', nl: 'z (peltek)' },
    type: 'peltek',
    example: { tr: 'zikir', nl: 'zikr' },
    specialNote: {
      tr: 'Dil dişlerin arasında - İngilizcede "this" gibi',
      nl: 'Tong tussen de tanden - zoals Engels "this"'
    }
  },
  RA: {
    id: 'ra',
    arabic: 'ر',
    name: 'Rā',
    pronunciation: { tr: 're', nl: 're' },
    type: 'normal',
    example: { tr: 'Ramazan', nl: 'Ramadan' }
  },
  ZAY: {
    id: 'zay',
    arabic: 'ز',
    name: 'Zāy',
    pronunciation: { tr: 'ze', nl: 'ze' },
    type: 'normal',
    example: { tr: 'zekat', nl: 'zakat' }
  },

  // Row 4: Sin to Dad
  SIN: {
    id: 'sin',
    arabic: 'س',
    name: 'Sīn',
    pronunciation: { tr: 'se', nl: 'se' },
    type: 'normal',
    example: { tr: 'selam', nl: 'vrede' }
  },
  SHIN: {
    id: 'shin',
    arabic: 'ش',
    name: 'Shīn',
    pronunciation: { tr: 'ş / sj', nl: 'sj' },
    type: 'normal',
    example: { tr: 'şükür', nl: 'dankbaarheid' }
  },
  SAD: {
    id: 'sad',
    arabic: 'ص',
    name: 'Ṣād',
    pronunciation: { tr: 's (kalın)', nl: 's (zwaar)' },
    type: 'heavy',
    example: { tr: 'sabır', nl: 'geduld' },
    specialNote: {
      tr: 'Kalın s sesi - ağzın arkasından',
      nl: 'Zware s-klank - van achterin de mond'
    }
  },
  DAD: {
    id: 'dad',
    arabic: 'ض',
    name: 'Ḍād',
    pronunciation: { tr: 'd (kalın)', nl: 'd (zwaar)' },
    type: 'heavy',
    example: { tr: 'Ramazan', nl: 'Ramadan' },
    specialNote: {
      tr: 'Kalın d sesi - Arapçaya özgü',
      nl: 'Zware d-klank - uniek aan het Arabisch'
    }
  },

  // Row 5: Ta (heavy) to Zha
  TA_HEAVY: {
    id: 'ta-heavy',
    arabic: 'ط',
    name: 'Ṭā',
    pronunciation: { tr: 't (kalın)', nl: 't (zwaar)' },
    type: 'heavy',
    example: { tr: 'namaz', nl: 'gebed' },
    specialNote: {
      tr: 'Kalın t sesi',
      nl: 'Zware t-klank'
    }
  },
  ZHA: {
    id: 'zha',
    arabic: 'ظ',
    name: 'Ẓā',
    pronunciation: { tr: 'z (peltek kalın)', nl: 'z (peltek zwaar)' },
    type: 'peltek',
    example: { tr: 'hafız', nl: 'haafiz' },
    specialNote: {
      tr: 'Hem peltek hem kalın - dil dişlerde, boğazdan',
      nl: 'Zowel peltek als zwaar - tong bij tanden, vanuit keel'
    }
  },

  // Row 6: Ayn to Ghayn
  AYN: {
    id: 'ayn',
    arabic: 'ع',
    name: 'ʿAyn',
    pronunciation: { tr: 'a (boğaz)', nl: 'a (keel)' },
    type: 'throat',
    example: { tr: 'amel', nl: 'daad' },
    specialNote: {
      tr: 'Boğazdan gelen özel ses - Türkçede yok',
      nl: 'Speciale keelklank - bestaat niet in het Nederlands'
    }
  },
  GHAYN: {
    id: 'ghayn',
    arabic: 'غ',
    name: 'Ghayn',
    pronunciation: { tr: 'ğ / g (boğaz)', nl: 'g (keel)' },
    type: 'throat',
    example: { tr: 'gaflet', nl: 'achteloosheid' },
    specialNote: {
      tr: 'Boğazdan gelen yumuşak g - Fransızca "r" gibi',
      nl: 'Zachte g vanuit keel - zoals Franse "r"'
    }
  },

  // Row 7: Fa to Qaf
  FA: {
    id: 'fa',
    arabic: 'ف',
    name: 'Fā',
    pronunciation: { tr: 'fe', nl: 'fe' },
    type: 'normal',
    example: { tr: 'farz', nl: 'verplichting' }
  },
  QAF: {
    id: 'qaf',
    arabic: 'ق',
    name: 'Qāf',
    pronunciation: { tr: 'k (boğaz kalın)', nl: 'k (keel zwaar)' },
    type: 'heavy',
    example: { tr: 'Kur\'an', nl: 'Koran' },
    specialNote: {
      tr: 'Boğazdan gelen kalın k - normal k\'dan daha derindir',
      nl: 'Zware k vanuit keel - dieper dan normale k'
    }
  },

  // Row 8: Kaf to Mim
  KAF: {
    id: 'kaf',
    arabic: 'ك',
    name: 'Kāf',
    pronunciation: { tr: 'k', nl: 'k' },
    type: 'normal',
    example: { tr: 'kelime', nl: 'woord' }
  },
  LAM: {
    id: 'lam',
    arabic: 'ل',
    name: 'Lām',
    pronunciation: { tr: 'l', nl: 'l' },
    type: 'normal',
    example: { tr: 'ilim', nl: 'kennis' }
  },
  MIM: {
    id: 'mim',
    arabic: 'م',
    name: 'Mīm',
    pronunciation: { tr: 'me', nl: 'me' },
    type: 'normal',
    example: { tr: 'mescid', nl: 'moskee' }
  },

  // Row 9: Nun to Ya
  NUN: {
    id: 'nun',
    arabic: 'ن',
    name: 'Nūn',
    pronunciation: { tr: 'ne', nl: 'ne' },
    type: 'normal',
    example: { tr: 'namaz', nl: 'gebed' }
  },
  HA_END: {
    id: 'ha-end',
    arabic: 'ه',
    name: 'Hā',
    pronunciation: { tr: 'he', nl: 'he' },
    type: 'normal',
    example: { tr: 'helal', nl: 'toegestaan' }
  },
  WAW: {
    id: 'waw',
    arabic: 'و',
    name: 'Wāw',
    pronunciation: { tr: 'v / u', nl: 'w / oe' },
    type: 'normal',
    example: { tr: 'vakit', nl: 'tijd' }
  },
  YA: {
    id: 'ya',
    arabic: 'ي',
    name: 'Yā',
    pronunciation: { tr: 'ye / i', nl: 'j / ie' },
    type: 'normal',
    example: { tr: 'yakın', nl: 'dichtbij' }
  },

  // Special: Lam-Alif
  LAM_ALIF: {
    id: 'lam-alif',
    arabic: 'لا',
    name: 'Lām-Alif',
    pronunciation: { tr: 'lā', nl: 'laa' },
    type: 'normal',
    example: { tr: 'lā ilahe illallah', nl: 'laa ilahe illallah' },
    specialNote: {
      tr: 'İki harfin birleşimi - lām ve alif',
      nl: 'Combinatie van twee letters - laam en alif'
    }
  }
};

// Helper function to get letter by ID
export function getLetter(id: string): ArabicLetter | undefined {
  return ARABIC_LETTERS[id.toUpperCase().replace('-', '_')];
}

// Helper function to get letter by Arabic character
export function getLetterByArabic(arabic: string): ArabicLetter | undefined {
  return Object.values(ARABIC_LETTERS).find(letter => letter.arabic === arabic);
}

// Helper function to get all letters as array
export function getAllLetters(): ArabicLetter[] {
  return Object.values(ARABIC_LETTERS);
}

// Helper function to get letters by type
export function getLettersByType(type: LetterType): ArabicLetter[] {
  return Object.values(ARABIC_LETTERS).filter(letter => letter.type === type);
}

// Export letter groups for easy reference in lessons
export const LETTER_GROUPS = {
  PELTEK: ['THA', 'DHAL', 'ZHA'],
  HEAVY: ['SAD', 'DAD', 'TA_HEAVY', 'QAF'],
  THROAT: ['HA', 'KHA', 'AYN', 'GHAYN'],
  NORMAL: ['ALIF', 'BA', 'TA', 'JIM', 'DAL', 'RA', 'ZAY', 'SIN', 'SHIN', 'FA', 'KAF', 'LAM', 'MIM', 'NUN', 'HA_END', 'WAW', 'YA']
};
