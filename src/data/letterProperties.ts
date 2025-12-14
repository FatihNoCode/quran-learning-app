// Letter properties for Arabic letters used in Quran reading

export interface LetterProperty {
  name: {
    tr: string;
    nl: string;
    ar: string;
  };
  pronunciation: string;
  type: 'kalın' | 'ince' | 'peltek'; // Thick (from throat) / Thin / With tongue against teeth
  typeDescription: {
    tr: string;
    nl: string;
  };
}

export const letterProperties: { [key: string]: LetterProperty } = {
  'ا': {
    name: { tr: 'Elif', nl: 'Alif', ar: 'ا' },
    pronunciation: 'e',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Boğazdan çıkmaz',
      nl: 'Dunne letter - Komt niet uit de keel'
    }
  },
  'ب': {
    name: { tr: 'Be', nl: 'Ba', ar: 'ب' },
    pronunciation: 'b',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dudaklardan çıkar',
      nl: 'Dunne letter - Komt van de lippen'
    }
  },
  'ت': {
    name: { tr: 'Te', nl: 'Ta', ar: 'ت' },
    pronunciation: 'te',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Diş ve damaktan çıkar',
      nl: 'Dunne letter - Komt van tanden en verhemelte'
    }
  },
  'ث': {
    name: { tr: 'Se (peltek)', nl: 'Tha (peltek)', ar: 'ث' },
    pronunciation: 'se',
    type: 'peltek',
    typeDescription: {
      tr: 'Peltek harf - Dil ön dişlere değer',
      nl: 'Peltek letter - Tong tegen voortanden'
    }
  },
  'ج': {
    name: { tr: 'Cim', nl: 'Jeem', ar: 'ج' },
    pronunciation: 'ce',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ortasından çıkar',
      nl: 'Dunne letter - Komt van het midden van de tong'
    }
  },
  'ح': {
    name: { tr: 'Ha', nl: 'Ha', ar: 'ح' },
    pronunciation: 'ha',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - Boğazın ortasından çıkar',
      nl: 'Dikke letter - Komt uit het midden van de keel'
    }
  },
  'خ': {
    name: { tr: 'Gha', nl: 'Kha', ar: 'خ' },
    pronunciation: 'gha',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - Boğazdan çıkar',
      nl: 'Dikke letter - Komt uit de keel'
    }
  },
  'د': {
    name: { tr: 'Dal', nl: 'Dal', ar: 'د' },
    pronunciation: 'da',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ucundan çıkar',
      nl: 'Dunne letter - Komt van de tongpunt'
    }
  },
  'ذ': {
    name: { tr: 'Zel (peltek)', nl: 'Thal (peltek)', ar: 'ذ' },
    pronunciation: 'zel',
    type: 'peltek',
    typeDescription: {
      tr: 'Peltek harf - Dil ön dişlere değer',
      nl: 'Peltek letter - Tong tegen voortanden'
    }
  },
  'ر': {
    name: { tr: 'Ra', nl: 'Ra', ar: 'ر' },
    pronunciation: 'ra',
    type: 'ince',
    typeDescription: {
      tr: 'İnce/Kalın (değişken) - Dilin ucundan çıkar',
      nl: 'Dun/Dik (variabel) - Komt van de tongpunt'
    }
  },
  'ز': {
    name: { tr: 'Ze', nl: 'Zay', ar: 'ز' },
    pronunciation: 'ze',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ucundan çıkar',
      nl: 'Dunne letter - Komt van de tongpunt'
    }
  },
  'س': {
    name: { tr: 'Sin', nl: 'Seen', ar: 'س' },
    pronunciation: 'se',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ucundan çıkar',
      nl: 'Dunne letter - Komt van de tongpunt'
    }
  },
  'ش': {
    name: { tr: 'Sjin', nl: 'Sheen', ar: 'ش' },
    pronunciation: 'sje',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ortasından çıkar',
      nl: 'Dunne letter - Komt van het midden van de tong'
    }
  },
  'ص': {
    name: { tr: 'Sad', nl: 'Sad', ar: 'ص' },
    pronunciation: 'sa',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - İstila yapan harf (damak kalkık)',
      nl: 'Dikke letter - Verhemelte omhoog'
    }
  },
  'ض': {
    name: { tr: 'Dad', nl: 'Dad', ar: 'ض' },
    pronunciation: 'da',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - İstila yapan harf (damak kalkık)',
      nl: 'Dikke letter - Verhemelte omhoog'
    }
  },
  'ط': {
    name: { tr: 'Ta', nl: 'Ta', ar: 'ط' },
    pronunciation: 'ta',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - İstila yapan harf (damak kalkık)',
      nl: 'Dikke letter - Verhemelte omhoog'
    }
  },
  'ظ': {
    name: { tr: 'Za (peltek)', nl: 'Za (peltek)', ar: 'ظ' },
    pronunciation: 'za',
    type: 'peltek',
    typeDescription: {
      tr: 'Peltek kalın harf - Dil ön dişlere değer, damak kalkık',
      nl: 'Peltek dikke letter - Tong tegen voortanden, verhemelte omhoog'
    }
  },
  'ع': {
    name: { tr: 'Ayn', nl: 'Ayn', ar: 'ع' },
    pronunciation: 'a',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - Boğazın ortasından çıkar',
      nl: 'Dikke letter - Komt uit het midden van de keel'
    }
  },
  'غ': {
    name: { tr: 'Ghain', nl: 'Ghain', ar: 'غ' },
    pronunciation: 'gha',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - Boğazdan çıkar',
      nl: 'Dikke letter - Komt uit de keel'
    }
  },
  'ف': {
    name: { tr: 'Fe', nl: 'Fa', ar: 'ف' },
    pronunciation: 'fe',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Alt dudak ve üst dişlerle çıkar',
      nl: 'Dunne letter - Onderlip en boventanden'
    }
  },
  'ق': {
    name: { tr: 'Kaf', nl: 'Qaf', ar: 'ق' },
    pronunciation: 'ka',
    type: 'kalın',
    typeDescription: {
      tr: 'Kalın harf - İstila yapan harf, boğazdan çıkar',
      nl: 'Dikke letter - Komt diep uit de keel'
    }
  },
  'ك': {
    name: { tr: 'Kef', nl: 'Kaf', ar: 'ك' },
    pronunciation: 'ke',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin arkasından çıkar',
      nl: 'Dunne letter - Komt van de achterkant van de tong'
    }
  },
  'ل': {
    name: { tr: 'Lam', nl: 'Lam', ar: 'ل' },
    pronunciation: 'la',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin kenarından çıkar',
      nl: 'Dunne letter - Komt van de zijkant van de tong'
    }
  },
  'م': {
    name: { tr: 'Mim', nl: 'Meem', ar: 'م' },
    pronunciation: 'me',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dudaklardan çıkar',
      nl: 'Dunne letter - Komt van de lippen'
    }
  },
  'ن': {
    name: { tr: 'Nun', nl: 'Noon', ar: 'ن' },
    pronunciation: 'ne',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ucundan çıkar',
      nl: 'Dunne letter - Komt van de tongpunt'
    }
  },
  'و': {
    name: { tr: 'Vav', nl: 'Waw', ar: 'و' },
    pronunciation: 've / we',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dudaklardan çıkar',
      nl: 'Dunne letter - Komt van de lippen'
    }
  },
  'ه': {
    name: { tr: 'He', nl: 'Ha', ar: 'ه' },
    pronunciation: 'he',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Boğazdan hafiفçe çıkar',
      nl: 'Dunne letter - Komt licht uit de keel'
    }
  },
  'لا': {
    name: { tr: 'Lamelif', nl: 'Lam-Alif', ar: 'لا' },
    pronunciation: 'lamelif',
    type: 'ince',
    typeDescription: {
      tr: 'Birleşik harf - Lam ve Elif birleşimi',
      nl: 'Gecombineerde letter - Lam en Alif samen'
    }
  },
  'ي': {
    name: { tr: 'Ye', nl: 'Ya', ar: 'ي' },
    pronunciation: 'ye',
    type: 'ince',
    typeDescription: {
      tr: 'İnce harf - Dilin ortasından çıkar',
      nl: 'Dunne letter - Komt van het midden van de tong'
    }
  }
};

// Helper function to get letter property
export function getLetterProperty(letter: string): LetterProperty | undefined {
  return letterProperties[letter];
}

// Type badges/colors for UI
export const typeColors = {
  kalın: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-800',
    badge: 'bg-red-500'
  },
  ince: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-800',
    badge: 'bg-blue-500'
  },
  peltek: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
    badge: 'bg-green-500'
  }
};
