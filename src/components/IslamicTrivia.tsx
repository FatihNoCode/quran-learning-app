import { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Star, Award, Sparkles, ArrowLeft } from 'lucide-react';

interface IslamicTriviaProps {
  language: 'tr' | 'nl';
  onBack?: () => void;
}

interface TriviaQuestion {
  id: string;
  question: { tr: string; nl: string };
  options: { tr: string[]; nl: string[] };
  correctAnswer: number;
  explanation: { tr: string; nl: string };
}

interface TriviaTheme {
  id: string;
  title: { tr: string; nl: string };
  emoji: string;
  color: string;
  questions: TriviaQuestion[];
}

const triviaThemes: TriviaTheme[] = [
  {
    id: 'fundamentals',
    title: { tr: 'İslam\'ın Temelleri', nl: 'Fundamenten van de Islam' },
    emoji: '📚',
    color: 'amber',
    questions: [
      {
        id: '1',
        question: { tr: 'Hadis nedir?', nl: 'Wat is een Hadith?' },
        options: { tr: ['Kur\'an ayeti', 'Hz. Muhammed\'in (s.a.v.) sözü ve davranışı', 'Namaz duası', 'Dua kitabı'], nl: ['Een vers uit de Koran', 'Een uitspraak of daad van Profeet Mohammed (vrede zij met hem)', 'Een gebed', 'Een dua boek'] },
        correctAnswer: 1,
        explanation: { tr: 'Hadis, Hz. Muhammed\'in (s.a.v.) söz, fiil ve takrirlerini anlatan rivayetlerdir', nl: 'Een Hadith is een overlevering van de uitspraken, daden en goedkeuringen van Profeet Mohammed (vrede zij met hem)' }
      },
      {
        id: '2',
        question: { tr: 'Sünnet nedir?', nl: 'Wat is de Sunnah?' },
        options: { tr: ['Peygamberin yolu', 'Kuran\'ın bir suresi', 'Bir ibadet şekli', 'Bir melek ismi'], nl: ['De weg van de Profeet Mohammed (vrede zij met hem)', 'Een hoofdstuk van de Koran', 'Een vorm van aanbidding', 'De naam van een engel'] },
        correctAnswer: 0,
        explanation: { tr: 'Sünnet, Peygamber Efendimizin (s.a.v.) hayat tarzı, sözleri ve davranışlarıdır', nl: 'Sunnah is de levenswijze, uitspraken en gedrag van Profeet Mohammed (vrede zij met hem) die moslims moeten volgen' }
      },
      {
        id: '3',
        question: { tr: 'İmanın kaç şartı vardır?', nl: 'Hoeveel geloofspijlers (artikelen van geloof) zijn er?' },
        options: { tr: ['4', '5', '6', '7'], nl: ['4', '5', '6', '7'] },
        correctAnswer: 2,
        explanation: { tr: 'İmanın 6 şartı vardır: Allah\'a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe ve kadere iman', nl: 'Er zijn 6 geloofspijlers: geloof in Allah, Zijn engelen, Zijn boeken, Zijn boodschappers, de Laatste Dag en het goddelijke lot (Qadr)' }
      },
      {
        id: '4',
        question: { tr: 'Tevhid nedir?', nl: 'Wat is Tawheed?' },
        options: { tr: ['Allah\'ın birliği', 'Namaz kılmak', 'Oruç tutmak', 'Sadaka vermek'], nl: ['Het geloof in de eenheid van Allah', 'Het verrichten van gebeden', 'Vasten', 'Aalmoezen geven'] },
        correctAnswer: 0,
        explanation: { tr: 'Tevhid, Allah\'ın bir ve tek olduğuna, ortağı olmadığına inanmaktır', nl: 'Tawheed is het geloof dat Allah één is, uniek en zonder partners' }
      },
      {
        id: '5',
        question: { tr: 'Şirk nedir?', nl: 'Wat is Shirk?' },
        options: { tr: ['Allah\'a ortak koşmak', 'Namaz kılmak', 'Dua etmek', 'Kur\'an okumak'], nl: ['Allah partners toekennen (het grootste zonde)', 'Bidden', 'Smeekbeden doen', 'De Koran lezen'] },
        correctAnswer: 0,
        explanation: { tr: 'Şirk, Allah\'a ortak koşmaktır ve İslam\'da en büyük günahtır', nl: 'Shirk betekent partners toekennen aan Allah en is de grootste zonde in de Islam' }
      },
      {
        id: '6',
        question: { tr: 'Kuran-ı Kerim kaç yılda indirildi?', nl: 'Over hoeveel jaar werd de Koran geopenbaard aan de Profeet (vrede zij met hem)?' },
        options: { tr: ['10 yıl', '15 yıl', '20 yıl', '23 yıl'], nl: ['10 jaar', '15 jaar', '20 jaar', '23 jaar'] },
        correctAnswer: 3,
        explanation: { tr: 'Kur\'an-ı Kerim 23 yılda Hz. Muhammed\'e (s.a.v.) vahyedilmiştir', nl: 'De Koran werd over een periode van 23 jaar geopenbaard aan Profeet Mohammed (vrede zij met hem)' }
      },
      {
        id: '7',
        question: { tr: 'İslam dini kaç yıllık bir dindir?', nl: 'Wanneer begon de islamitische kalender (Hijri kalender)?' },
        options: { tr: ['Hz. Muhammed\'in doğumu', 'İlk vahiy', 'Mekke\'den Medine\'ye hicret', 'Hz. Muhammed\'in vefatı'], nl: ['Geboorte van Profeet Mohammed (vrede zij met hem)', 'Eerste openbaring', 'Emigratie van Mekka naar Medina (Hijra)', 'Overlijden van de Profeet (vrede zij met hem)'] },
        correctAnswer: 2,
        explanation: { tr: 'Hicri takvim, Hz. Muhammed\'in (s.a.v.) Mekke\'den Medine\'ye hicret ettiği yıl başlar (622 M.S.)', nl: 'De islamitische kalender begon met de Hijra, de emigratie van Profeet Mohammed (vrede zij met hem) van Mekka naar Medina in 622 na Christus' }
      },
      {
        id: '8',
        question: { tr: 'Halal ne demektir?', nl: 'Wat betekent Halal?' },
        options: { tr: ['Helal, İslam\'a göre izin verilen', 'Yasak olan', 'Şüpheli olan', 'Sadece yemek'], nl: ['Toegestaan volgens de islamitische wet', 'Verboden', 'Twijfelachtig', 'Alleen voedsel'] },
        correctAnswer: 0,
        explanation: { tr: 'Halal, İslam\'a göre izin verilen, helal olan şeylerdir', nl: 'Halal betekent wat toegestaan en rechtmatig is volgens de islamitische wet (Sharia)' }
      },
      {
        id: '9',
        question: { tr: 'Haram ne demektir?', nl: 'Wat betekent Haram?' },
        options: { tr: ['İzin verilen', 'İslam\'a göre yasak olan', 'Sünnet olan', 'Farz olan'], nl: ['Toegestaan', 'Verboden volgens de islamitische wet', 'Aanbevolen', 'Verplicht'] },
        correctAnswer: 1,
        explanation: { tr: 'Haram, İslam\'a göre kesinlikle yasak olan şeylerdir', nl: 'Haram betekent wat strikt verboden is volgens de islamitische wet' }
      },
      {
        id: '10',
        question: { tr: 'Müslüman kimdir?', nl: 'Wie is een moslim?' },
        options: { tr: ['Camiye giden', 'Allah\'a ve Peygamberine iman eden', 'Sadece namaz kılan', 'Arapça konuşan'], nl: ['Iemand die naar de moskee gaat', 'Iemand die gelooft in Allah en Zijn Boodschapper Mohammed (vrede zij met hem)', 'Iemand die alleen bidt', 'Iemand die Arabisch spreekt'] },
        correctAnswer: 1,
        explanation: { tr: 'Müslüman, Allah\'a ve O\'nun elçisi Hz. Muhammed\'e (s.a.v.) iman eden ve teslim olan kişidir', nl: 'Een moslim is iemand die gelooft in Allah en zich onderwerpt aan Zijn wil, en Profeet Mohammed (vrede zij met hem) als Zijn laatste Boodschapper accepteert' }
      }
    ]
  },
  {
    id: 'pillars',
    title: { tr: 'İslam\'ın Şartları', nl: 'Pilaren van de Islam' },
    emoji: '🕌',
    color: 'purple',
    questions: [
      {
        id: '1',
        question: { tr: 'İslam\'ın kaç şartı vardır?', nl: 'Hoeveel pilaren heeft de Islam?' },
        options: { tr: ['3', '5', '7', '10'], nl: ['3', '5', '7', '10'] },
        correctAnswer: 1,
        explanation: { tr: 'İslam\'ın 5 şartı vardır', nl: 'De Islam heeft 5 pilaren (fundamentele religieuze verplichtingen)' }
      },
      {
        id: '2',
        question: { tr: 'İslam\'ın ilk şartı nedir?', nl: 'Wat is de eerste pilaar van de Islam?' },
        options: { tr: ['Namaz', 'Kelime-i Şehadet', 'Zekat', 'Oruç'], nl: ['Gebed', 'Shahada (geloofsbelijdenis)', 'Zakat', 'Vasten'] },
        correctAnswer: 1,
        explanation: { tr: 'Kelime-i Şehadet İslam\'ın ilk şartıdır', nl: 'De Shahada (geloofsbelijdenis) is de eerste pilaar: "Er is geen god dan Allah en Mohammed is Zijn boodschapper"' }
      },
      {
        id: '3',
        question: { tr: 'Namaz İslam\'ın kaçıncı şartıdır?', nl: 'Welke pilaar is het gebed (Salah)?' },
        options: { tr: ['1.', '2.', '3.', '4.'], nl: ['1e', '2e', '3e', '4e'] },
        correctAnswer: 1,
        explanation: { tr: 'Namaz İslam\'ın 2. şartıdır', nl: 'Het gebed (Salah) is de 2e pilaar - vijf dagelijkse gebeden' }
      },
      {
        id: '4',
        question: { tr: 'Zekat nedir?', nl: 'Wat is Zakat?' },
        options: { tr: ['Oruç', 'Sadaka', 'Malın zekatını vermek', 'Namaz'], nl: ['Vasten', 'Vrijwillige aalmoezen', 'Verplichte aalmoezen (2,5% van je vermogen)', 'Gebed'] },
        correctAnswer: 2,
        explanation: { tr: 'Zekat, malın bir kısmını (genellikle %2.5) fakirlere vermektir', nl: 'Zakat is verplichte aalmoezen - moslims geven 2,5% van hun vermogen aan de armen en behoeftigen' }
      },
      {
        id: '5',
        question: { tr: 'Ramazan ayında hangi ibadet yapılır?', nl: 'Welke religieuze plicht wordt in de maand Ramadan verricht?' },
        options: { tr: ['Hac', 'Oruç', 'Umre', 'Kurban'], nl: ['Hadj', 'Vasten (Sawm)', 'Umrah', 'Offer'] },
        correctAnswer: 1,
        explanation: { tr: 'Ramazan ayında oruç tutulur', nl: 'In de maand Ramadan vasten moslims van zonsopgang tot zonsondergang' }
      },
      {
        id: '6',
        question: { tr: 'Hac ibadeti nerede yapılır?', nl: 'Waar wordt de Hadj (bedevaart) verricht?' },
        options: { tr: ['Medine', 'Kudüs', 'Mekke', 'Şam'], nl: ['Medina', 'Jeruzalem', 'Mekka', 'Damascus'] },
        correctAnswer: 2,
        explanation: { tr: 'Hac ibadeti Mekke\'de yapılır', nl: 'De Hadj wordt verricht in en rond Mekka in Saoedi-Arabië' }
      },
      {
        id: '7',
        question: { tr: 'Kabe hangi şehirdedir?', nl: 'In welke stad staat de Ka\'aba?' },
        options: { tr: ['Medine', 'Mekke', 'Cidde', 'Riyad'], nl: ['Medina', 'Mekka', 'Jeddah', 'Riyadh'] },
        correctAnswer: 1,
        explanation: { tr: 'Kabe Mekke\'dedir', nl: 'De Ka\'aba staat in Mekka - dit is het heiligste gebouw in de Islam waar moslims naartoe bidden' }
      },
      {
        id: '8',
        question: { tr: 'Bir günde kaç vakit namaz kılınır?', nl: 'Hoeveel verplichte gebeden zijn er per dag?' },
        options: { tr: ['3', '5', '7', '9'], nl: ['3', '5', '7', '9'] },
        correctAnswer: 1,
        explanation: { tr: 'Günde 5 vakit namaz kılınır', nl: 'Er zijn 5 verplichte dagelijkse gebeden: Fajr, Dhuhr, Asr, Maghrib en Isha' }
      },
      {
        id: '9',
        question: { tr: 'Hac İslam\'ın kaçıncı şartıdır?', nl: 'Welke pilaar is de Hadj?' },
        options: { tr: ['2.', '3.', '4.', '5.'], nl: ['2e', '3e', '4e', '5e'] },
        correctAnswer: 3,
        explanation: { tr: 'Hac İslam\'ın 5. şartıdır', nl: 'De Hadj (bedevaart naar Mekka) is de 5e pilaar - verplicht één keer in je leven als je het kunt betalen' }
      },
      {
        id: '10',
        question: { tr: 'Zekat İslam\'ın kaçıncı şartıdır?', nl: 'Welke pilaar is Zakat?' },
        options: { tr: ['1.', '2.', '3.', '4.'], nl: ['1e', '2e', '3e', '4e'] },
        correctAnswer: 2,
        explanation: { tr: 'Zekat İslam\'ın 3. şartıdır', nl: 'Zakat (verplichte aalmoezen) is de 3e pilaar van de Islam' }
      }
    ]
  },
  {
    id: 'quran',
    title: { tr: 'Kur\'an-ı Kerim', nl: 'De Heilige Koran' },
    emoji: '📖',
    color: 'green',
    questions: [
      {
        id: '1',
        question: { tr: 'Kur\'an kaç sureden oluşur?', nl: 'Hoeveel hoofdstukken (soera\'s) heeft de Koran?' },
        options: { tr: ['30', '114', '99', '150'], nl: ['30', '114', '99', '150'] },
        correctAnswer: 1,
        explanation: { tr: 'Kur\'an 114 sureden oluşur', nl: 'De Koran heeft 114 hoofdstukken (soera\'s)' }
      },
      {
        id: '2',
        question: { tr: 'Kur\'an\'ın ilk suresi hangisidir?', nl: 'Wat is het eerste hoofdstuk van de Koran?' },
        options: { tr: ['Al-Baqarah', 'Al-Fatiha', 'Al-Ikhlas', 'An-Nas'], nl: ['Al-Baqarah', 'Al-Fatiha (De Opening)', 'Al-Ikhlas', 'An-Nas'] },
        correctAnswer: 1,
        explanation: { tr: 'Fatiha suresi ilk suredir', nl: 'Al-Fatiha (De Opening) is het eerste hoofdstuk en wordt gereciteerd in elk gebed' }
      },
      {
        id: '3',
        question: { tr: 'Kur\'an hangi dilde indirildi?', nl: 'In welke taal werd de Koran geopenbaard?' },
        options: { tr: ['Türkçe', 'Arapça', 'Farsça', 'Urduca'], nl: ['Turks', 'Arabisch', 'Perzisch', 'Urdu'] },
        correctAnswer: 1,
        explanation: { tr: 'Kur\'an Arapça indirildi', nl: 'De Koran werd geopenbaard in het klassiek Arabisch' }
      },
      {
        id: '4',
        question: { tr: 'Kur\'an kaç cüz\'den oluşur?', nl: 'In hoeveel delen (juz) is de Koran verdeeld?' },
        options: { tr: ['20', '25', '30', '40'], nl: ['20', '25', '30', '40'] },
        correctAnswer: 2,
        explanation: { tr: 'Kur\'an 30 cüzden oluşur', nl: 'De Koran is verdeeld in 30 delen (juz) om het lezen makkelijker te maken' }
      },
      {
        id: '5',
        question: { tr: 'Kur\'an\'da en uzun sure hangisidir?', nl: 'Wat is het langste hoofdstuk in de Koran?' },
        options: { tr: ['Al-Fatiha', 'Al-Baqarah', 'Al-Imran', 'An-Nisa'], nl: ['Al-Fatiha', 'Al-Baqarah (De Koe)', 'Al-Imran', 'An-Nisa'] },
        correctAnswer: 1,
        explanation: { tr: 'Bakara suresi en uzun suredir', nl: 'Al-Baqarah (De Koe) is het langste hoofdstuk met 286 verzen' }
      },
      {
        id: '6',
        question: { tr: 'Kur\'an\'da en kısa sure hangisidir?', nl: 'Wat is het kortste hoofdstuk in de Koran?' },
        options: { tr: ['Al-Asr', 'Al-Kevser', 'Al-Ikhlas', 'An-Nas'], nl: ['Al-Asr', 'Al-Kawthar (De Overvloed)', 'Al-Ikhlas', 'An-Nas'] },
        correctAnswer: 1,
        explanation: { tr: 'Kevser suresi en kısa suredir', nl: 'Al-Kawthar is het kortste hoofdstuk met slechts 3 verzen' }
      },
      {
        id: '7',
        question: { tr: 'Fatiha suresinde kaç ayet vardır?', nl: 'Hoeveel verzen heeft Al-Fatiha?' },
        options: { tr: ['5', '7', '9', '11'], nl: ['5', '7', '9', '11'] },
        correctAnswer: 1,
        explanation: { tr: 'Fatiha suresinde 7 ayet vardır', nl: 'Al-Fatiha heeft 7 verzen en wordt daarom ook "De Zeven Veelherhaalde" genoemd' }
      },
      {
        id: '8',
        question: { tr: 'Kur\'an hangi ayda indirilmeye başlandı?', nl: 'In welke maand begon de openbaring van de Koran?' },
        options: { tr: ['Muharrem', 'Ramazan', 'Şaban', 'Zilhicce'], nl: ['Muharram', 'Ramadan', 'Sha\'ban', 'Dhul-Hijjah'] },
        correctAnswer: 1,
        explanation: { tr: 'Kur\'an Ramazan ayında indirilmeye başlandı', nl: 'De openbaring van de Koran begon in de maand Ramadan op Laylatul Qadr (de Nacht van de Macht)' }
      },
      {
        id: '9',
        question: { tr: 'Kur\'an\'ı Hz. Muhammed\'e (s.a.v.) kim getirdi?', nl: 'Welke engel bracht de Koran aan Profeet Mohammed (vrede zij met hem)?' },
        options: { tr: ['Mikail', 'İsrafil', 'Cebrail', 'Azrail'], nl: ['Mikail', 'Israfil', 'Djibriel (Gabriël)', 'Azrail'] },
        correctAnswer: 2,
        explanation: { tr: 'Cebrail (a.s.) Kur\'an\'ı getirdi', nl: 'Engel Djibriel (Gabriël) bracht de openbaring van Allah aan Profeet Mohammed (vrede zij met hem)' }
      },
      {
        id: '10',
        question: { tr: 'İhlas suresi neyi anlatır?', nl: 'Waar gaat Al-Ikhlas (De Oprechtheid) over?' },
        options: { tr: ['Allah\'ın birliğini', 'Namaz', 'Oruç', 'Hac'], nl: ['De eenheid van Allah (Tawheed)', 'Gebed', 'Vasten', 'Hadj'] },
        correctAnswer: 0,
        explanation: { tr: 'İhlas suresi Allah\'ın birliğini anlatır', nl: 'Al-Ikhlas verklaart de eenheid en uniciteit van Allah (Tawheed)' }
      }
    ]
  },
  {
    id: 'prophets',
    title: { tr: 'Peygamberler', nl: 'Profeten' },
    emoji: '👤',
    color: 'blue',
    questions: [
      {
        id: '1',
        question: { tr: 'İlk peygamber kimdir?', nl: 'Wie was de eerste profeet die Allah stuurde?' },
        options: { tr: ['Hz. Adem', 'Hz. Nuh', 'Hz. İbrahim', 'Hz. Musa'], nl: ['Adam', 'Noach', 'Abraham', 'Mozes'] },
        correctAnswer: 0,
        explanation: { tr: 'Hz. Adem (a.s.) ilk peygamberdir', nl: 'Adam (vrede zij met hem) was de eerste profeet en de eerste mens' }
      },
      {
        id: '2',
        question: { tr: 'Son peygamber kimdir?', nl: 'Wie is de laatste profeet die Allah stuurde?' },
        options: { tr: ['Hz. İsa', 'Hz. Musa', 'Hz. Muhammed', 'Hz. İbrahim'], nl: ['Jezus', 'Mozes', 'Mohammed', 'Abraham'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Muhammed (s.a.v.) son peygamberdir', nl: 'Mohammed (vrede zij met hem) is de laatste profeet - na hem komt geen nieuwe profeet' }
      },
      {
        id: '3',
        question: { tr: 'Kur\'an\'da kaç peygamber ismi geçer?', nl: 'Hoeveel profeten worden bij naam genoemd in de Koran?' },
        options: { tr: ['15', '20', '25', '30'], nl: ['15', '20', '25', '30'] },
        correctAnswer: 2,
        explanation: { tr: 'Kur\'an\'da 25 peygamber ismi geçer', nl: 'Er worden 25 profeten bij naam genoemd in de Koran, hoewel er in totaal 124.000 profeten zijn gestuurd' }
      },
      {
        id: '4',
        question: { tr: 'Hz. Nuh kaç yıl yaşadı?', nl: 'Hoe oud werd profeet Noach (vrede zij met hem)?' },
        options: { tr: ['500', '750', '950', '1200'], nl: ['500', '750', '950', '1200'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Nuh 950 yıl yaşadı', nl: 'Profeet Noach (vrede zij met hem) werd 950 jaar oud volgens de Koran' }
      },
      {
        id: '5',
        question: { tr: 'Hz. Muhammed (s.a.v.) kaç yaşında vefat etti?', nl: 'Hoe oud was Profeet Mohammed (vrede zij met hem) toen hij overleed?' },
        options: { tr: ['50', '55', '60', '63'], nl: ['50', '55', '60', '63'] },
        correctAnswer: 3,
        explanation: { tr: 'Hz. Muhammed (s.a.v.) 63 yaşında vefat etti', nl: 'Profeet Mohammed (vrede zij met hem) was 63 jaar oud toen hij overleed' }
      },
      {
        id: '6',
        question: { tr: 'Hz. İbrahim\'in babası kimdir?', nl: 'Wie was de vader van profeet Abraham (vrede zij met hem)?' },
        options: { tr: ['Azar', 'Yakub', 'İsmail', 'İshak'], nl: ['Azar', 'Jakob', 'Ismaël', 'Isaak'] },
        correctAnswer: 0,
        explanation: { tr: 'Hz. İbrahim\'in babası Azar\'dır', nl: 'De vader van profeet Abraham (vrede zij met hem) was Azar, die afgoden aanbad' }
      },
      {
        id: '7',
        question: { tr: 'Hz. Musa\'ya hangi kitap verildi?', nl: 'Welk heilig boek ontving profeet Mozes (vrede zij met hem)?' },
        options: { tr: ['Tevrat', 'Zebur', 'İncil', 'Kur\'an'], nl: ['Torah (Taurat)', 'Psalmen (Zabur)', 'Evangelie (Injil)', 'Koran'] },
        correctAnswer: 0,
        explanation: { tr: 'Hz. Musa\'ya Tevrat verildi', nl: 'Profeet Mozes (vrede zij met hem) ontving de Torah (Taurat) van Allah' }
      },
      {
        id: '8',
        question: { tr: 'Hz. İsa\'ya hangi kitap verildi?', nl: 'Welk heilig boek ontving profeet Jezus (vrede zij met hem)?' },
        options: { tr: ['Tevrat', 'Zebur', 'İncil', 'Sahife'], nl: ['Torah', 'Psalmen', 'Evangelie (Injil)', 'Schriften'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. İsa\'ya İncil verildi', nl: 'Profeet Jezus (vrede zij met hem) ontving het Evangelie (Injil) van Allah' }
      },
      {
        id: '9',
        question: { tr: 'Hz. Davud\'a hangi kitap verildi?', nl: 'Welk heilig boek ontving profeet David (vrede zij met hem)?' },
        options: { tr: ['Tevrat', 'Zebur', 'İncil', 'Kur\'an'], nl: ['Torah', 'Psalmen (Zabur)', 'Evangelie', 'Koran'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Davud\'a Zebur verildi', nl: 'Profeet David (vrede zij met hem) ontving de Psalmen (Zabur) van Allah' }
      },
      {
        id: '10',
        question: { tr: 'Hz. Yusuf\'un kaç kardeşi vardı?', nl: 'Hoeveel broers had profeet Jozef (vrede zij met hem)?' },
        options: { tr: ['10', '11', '12', '13'], nl: ['10', '11', '12', '13'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Yusuf\'un 11 kardeşi vardı', nl: 'Profeet Jozef (vrede zij met hem) had 11 broers die jaloers op hem waren' }
      }
    ]
  },
  {
    id: 'prayer',
    title: { tr: 'Namaz', nl: 'Het Gebed' },
    emoji: '🤲',
    color: 'indigo',
    questions: [
      {
        id: '1',
        question: { tr: 'Sabah namazı kaç rekattır?', nl: 'Hoeveel rakaat (gebedseenheden) is het Fajr gebed?' },
        options: { tr: ['2', '3', '4', '5'], nl: ['2', '3', '4', '5'] },
        correctAnswer: 0,
        explanation: { tr: 'Sabah namazı 2 rekattır', nl: 'Het Fajr (ochtend) gebed is 2 rakaat' }
      },
      {
        id: '2',
        question: { tr: 'Öğle namazı kaç rekattır?', nl: 'Hoeveel rakaat is het Dhuhr gebed?' },
        options: { tr: ['2', '3', '4', '5'], nl: ['2', '3', '4', '5'] },
        correctAnswer: 2,
        explanation: { tr: 'Öğle namazı 4 rekattır', nl: 'Het Dhuhr (middag) gebed is 4 rakaat' }
      },
      {
        id: '3',
        question: { tr: 'Akşam namazı kaç rekattır?', nl: 'Hoeveel rakaat is het Maghrib gebed?' },
        options: { tr: ['2', '3', '4', '5'], nl: ['2', '3', '4', '5'] },
        correctAnswer: 1,
        explanation: { tr: 'Akşam namazı 3 rekattır', nl: 'Het Maghrib (zonsondergang) gebed is 3 rakaat' }
      },
      {
        id: '4',
        question: { tr: 'Namaz kılmadan önce ne yapmak gerekir?', nl: 'Wat moet je doen voordat je het gebed verricht?' },
        options: { tr: ['Yemek', 'Abdest', 'Uyumak', 'Koşmak'], nl: ['Eten', 'Wudu (rituele wassing)', 'Slapen', 'Rennen'] },
        correctAnswer: 1,
        explanation: { tr: 'Namaz için abdest gerekir', nl: 'Je moet wudu (rituele wassing) doen om ritueel rein te zijn voor het gebed' }
      },
      {
        id: '5',
        question: { tr: 'Namazda hangi yöne dönülür?', nl: 'Welke richting draai je op tijdens het gebed?' },
        options: { tr: ['Doğuya', 'Batıya', 'Kıbleye', 'Kuzeye'], nl: ['Oost', 'West', 'Qibla (richting Ka\'aba)', 'Noord'] },
        correctAnswer: 2,
        explanation: { tr: 'Namazda kıbleye dönülür', nl: 'We draaien naar de Qibla - de richting van de Ka\'aba in Mekka' }
      },
      {
        id: '6',
        question: { tr: 'Namaza nasıl başlanır?', nl: 'Hoe begin je het gebed?' },
        options: { tr: ['Rüku', 'Tekbir', 'Secde', 'Selam'], nl: ['Rukoo (buigen)', 'Takbeer (Allahu Akbar zeggen)', 'Sujood (knielen)', 'Salaam (groet)'] },
        correctAnswer: 1,
        explanation: { tr: 'Namaz tekbirle başlar', nl: 'Het gebed begint met Takbeer - je handen opsteken en "Allahu Akbar" (Allah is de Grootste) zeggen' }
      },
      {
        id: '7',
        question: { tr: 'Cemaatle namaz kılmak nerede yapılır?', nl: 'Waar wordt het gemeenschapsgebed meestal verricht?' },
        options: { tr: ['Evde', 'Camide', 'Parkta', 'Arabada'], nl: ['Thuis', 'Moskee', 'Park', 'Auto'] },
        correctAnswer: 1,
        explanation: { tr: 'Cemaatle namaz camide kılınır', nl: 'Het gemeenschapsgebed wordt meestal in de moskee verricht, wat veel meer beloond wordt' }
      },
      {
        id: '8',
        question: { tr: 'Cuma namazı hangi gün kılınır?', nl: 'Welke dag is het vrijdaggebed (Jumu\'ah)?' },
        options: { tr: ['Pazartesi', 'Çarşamba', 'Cuma', 'Pazar'], nl: ['Maandag', 'Woensdag', 'Vrijdag', 'Zondag'] },
        correctAnswer: 2,
        explanation: { tr: 'Cuma namazı Cuma günü kılınır', nl: 'Jumu\'ah (vrijdaggebed) wordt op vrijdag verricht - de heiligste dag van de week voor moslims' }
      },
      {
        id: '9',
        question: { tr: 'Yatsı namazı kaç rekattır?', nl: 'Hoeveel rakaat is het Isha gebed?' },
        options: { tr: ['2', '3', '4', '5'], nl: ['2', '3', '4', '5'] },
        correctAnswer: 2,
        explanation: { tr: 'Yatsı namazı 4 rekattır', nl: 'Het Isha (nacht) gebed is 4 rakaat' }
      },
      {
        id: '10',
        question: { tr: 'Namaz bitince ne denir?', nl: 'Hoe eindig je het gebed?' },
        options: { tr: ['Tekbir', 'Selam', 'Rüku', 'Secde'], nl: ['Takbeer', 'Salaam (vrede)', 'Rukoo', 'Sujood'] },
        correctAnswer: 1,
        explanation: { tr: 'Namaz selamla biter', nl: 'Het gebed eindigt met Salaam - je draait je hoofd naar rechts en links en zegt "Assalamu alaikum wa rahmatullah" (vrede zij met jullie en de genade van Allah)' }
      }
    ]
  },
  {
    id: 'angels',
    title: { tr: 'Melekler', nl: 'Engelen' },
    emoji: '👼',
    color: 'yellow',
    questions: [
      {
        id: '1',
        question: { tr: 'Vahiy meleği kimdir?', nl: 'Welke engel bracht de openbaringen van Allah?' },
        options: { tr: ['Mikail', 'İsrafil', 'Cebrail', 'Azrail'], nl: ['Mikail', 'Israfil', 'Djibriel (Gabriël)', 'Azrail'] },
        correctAnswer: 2,
        explanation: { tr: 'Cebrail vahiy meleğidir', nl: 'Djibriel (Gabriël) is de engel van openbaring die de boodschappen van Allah aan de profeten bracht' }
      },
      {
        id: '2',
        question: { tr: 'Can alan melek kimdir?', nl: 'Welke engel neemt de ziel wanneer iemand sterft?' },
        options: { tr: ['Mikail', 'İsrafil', 'Cebrail', 'Azrail'], nl: ['Mikail', 'Israfil', 'Djibriel', 'Azrail (Engel van de Dood)'] },
        correctAnswer: 3,
        explanation: { tr: 'Azrail can alan melektir', nl: 'Azrail is de engel van de dood die de zielen neemt wanneer mensen sterven' }
      },
      {
        id: '3',
        question: { tr: 'Rızık meleği kimdir?', nl: 'Welke engel zorgt voor voedsel en voorzieningen?' },
        options: { tr: ['Mikail', 'İsrafil', 'Cebrail', 'Azrail'], nl: ['Mikail', 'Israfil', 'Djibriel', 'Azrail'] },
        correctAnswer: 0,
        explanation: { tr: 'Mikail rızık meleğidir', nl: 'Mikail is de engel verantwoordelijk voor voorzieningen, regen en natuurfenomenen' }
      },
      {
        id: '4',
        question: { tr: 'Sur\'a üfleyecek melek kimdir?', nl: 'Welke engel zal op de hoorn blazen op de Dag des Oordeels?' },
        options: { tr: ['Mikail', 'İsrafil', 'Cebrail', 'Azrail'], nl: ['Mikail', 'Israfil', 'Djibriel', 'Azrail'] },
        correctAnswer: 1,
        explanation: { tr: 'İsrafil sur\'a üfler', nl: 'Israfil zal op de hoorn (Sur) blazen om het begin van de Dag des Oordeels aan te kondigen' }
      },
      {
        id: '5',
        question: { tr: 'Melekler neden yaratıldı?', nl: 'Waarvoor heeft Allah de engelen geschapen?' },
        options: { tr: ['Yemek için', 'İbadet için', 'Uyumak için', 'Oynamak için'], nl: ['Om te eten', 'Om Allah te aanbidden en Hem te dienen', 'Om te slapen', 'Om te spelen'] },
        correctAnswer: 1,
        explanation: { tr: 'Melekler ibadet için yaratıldı', nl: 'Engelen zijn geschapen van licht om Allah te aanbidden en Zijn bevelen uit te voeren' }
      },
      {
        id: '6',
        question: { tr: 'Melekler ne yapmaz?', nl: 'Wat kunnen engelen nooit doen?' },
        options: { tr: ['İbadet', 'Günah', 'Emir dinleme', 'Dua'], nl: ['Aanbidden', 'Zondigen', 'Gehoorzamen', 'Bidden'] },
        correctAnswer: 1,
        explanation: { tr: 'Melekler günah yapmazlar', nl: 'Engelen kunnen nooit zondigen - ze zijn altijd gehoorzaam aan Allah' }
      },
      {
        id: '7',
        question: { tr: 'Sağ omuzda hangi melek var?', nl: 'Welke engel op je rechterschouder schrijft je goede daden op?' },
        options: { tr: ['Kiramen Katibin', 'Münker', 'Nekir', 'Ridvan'], nl: ['Kiramen Katibin (de Nobele Schrijvers)', 'Munkar', 'Nakir', 'Ridwan'] },
        correctAnswer: 0,
        explanation: { tr: 'Kiramen Katibin iyilikleri yazar', nl: 'Er zijn twee Kiramen Katibin engelen - de rechter schrijft goede daden en de linker schrijft slechte daden' }
      },
      {
        id: '8',
        question: { tr: 'Cennetin kapıcısı kim?', nl: 'Welke engel bewaakt de poorten van het Paradijs?' },
        options: { tr: ['Malik', 'Ridvan', 'Azrail', 'Mikail'], nl: ['Malik', 'Ridwan', 'Azrail', 'Mikail'] },
        correctAnswer: 1,
        explanation: { tr: 'Ridvan cennetin kapıcısıdır', nl: 'Ridwan is de engel die de poorten van het Paradijs (Jannah) bewaakt' }
      },
      {
        id: '9',
        question: { tr: 'Cehennemin kapıcısı kim?', nl: 'Welke engel bewaakt de poorten van de Hel?' },
        options: { tr: ['Malik', 'Ridvan', 'Azrail', 'Mikail'], nl: ['Malik', 'Ridwan', 'Azrail', 'Mikail'] },
        correctAnswer: 0,
        explanation: { tr: 'Malik cehennemin kapıcısıdır', nl: 'Malik is de engel die de poorten van de Hel (Jahannam) bewaakt' }
      },
      {
        id: '10',
        question: { tr: 'Melekler neden yaratılmıştır?', nl: 'Waarvan zijn engelen geschapen?' },
        options: { tr: ['Topraktan', 'Ateşten', 'Nurdan', 'Sudan'], nl: ['Aarde (klei)', 'Vuur', 'Licht (Noor)', 'Water'] },
        correctAnswer: 2,
        explanation: { tr: 'Melekler nurdan yaratılmıştır', nl: 'Engelen zijn geschapen van licht (Noor), mensen van klei en djinn van vuur' }
      }
    ]
  },
  {
    id: 'manners',
    title: { tr: 'İslami Adab', nl: 'Islamitische Manieren' },
    emoji: '🌟',
    color: 'pink',
    questions: [
      {
        id: '1',
        question: { tr: 'Hangi elle yemek yenir?', nl: 'Met welke hand moet je volgens de Sunnah eten?' },
        options: { tr: ['Sol', 'Sağ', 'İkisi', 'Farketmez'], nl: ['Linkerhand', 'Rechterhand', 'Beide handen', 'Maakt niet uit'] },
        correctAnswer: 1,
        explanation: { tr: 'Sağ elle yenir', nl: 'Volgens de Sunnah van Profeet Mohammed (vrede zij met hem) eten we met onze rechterhand' }
      },
      {
        id: '2',
        question: { tr: 'Müslüman nasıl selamlaşır?', nl: 'Hoe groeten moslims elkaar volgens de islamitische traditie?' },
        options: { tr: ['Merhaba', 'Selam', 'Esselamü aleyküm', 'Günaydın'], nl: ['Hallo', 'Hoi', 'Assalamu alaikum', 'Goedendag'] },
        correctAnswer: 2,
        explanation: { tr: 'Esselamü aleyküm denir', nl: 'Moslims groeten elkaar met "Assalamu alaikum" (vrede zij met jullie) en antwoorden "Wa alaikum assalam" (en met jullie zij vrede)' }
      },
      {
        id: '3',
        question: { tr: 'Yemekten önce ne denir?', nl: 'Wat zeg je voordat je gaat eten?' },
        options: { tr: ['Elhamdülillah', 'Bismillah', 'Maşallah', 'İnşallah'], nl: ['Alhamdulillah', 'Bismillah', 'Mashallah', 'Inshallah'] },
        correctAnswer: 1,
        explanation: { tr: 'Bismillah denir', nl: 'We zeggen "Bismillah" (in de naam van Allah) voordat we eten of iets beginnen' }
      },
      {
        id: '4',
        question: { tr: 'Yemekten sonra ne denir?', nl: 'Wat zeg je nadat je hebt gegeten?' },
        options: { tr: ['Elhamdülillah', 'Bismillah', 'Maşallah', 'Sübhanallah'], nl: ['Alhamdulillah', 'Bismillah', 'Mashallah', 'Subhanallah'] },
        correctAnswer: 0,
        explanation: { tr: 'Elhamdülillah denir', nl: 'We zeggen "Alhamdulillah" (alle lof zij Allah) na het eten om Allah te danken' }
      },
      {
        id: '5',
        question: { tr: 'Anneye babaya nasıl davranılır?', nl: 'Hoe moeten we omgaan met onze ouders volgens de Islam?' },
        options: { tr: ['Saygısız', 'Saygılı', 'Kızgın', 'Kayıtsız'], nl: ['Oneerbiedig', 'Eerbiedig en respectvol', 'Boos', 'Onverschillig'] },
        correctAnswer: 1,
        explanation: { tr: 'Saygılı davranılır', nl: 'We moeten eerbiedig en respectvol zijn tegenover onze ouders - de Koran benadrukt dit vele malen' }
      },
      {
        id: '6',
        question: { tr: 'Güzel birşey görünce ne denir?', nl: 'Wat zeg je wanneer je iets moois of goeds ziet?' },
        options: { tr: ['Elhamdülillah', 'Bismillah', 'Maşallah', 'İnşallah'], nl: ['Alhamdulillah', 'Bismillah', 'Mashallah', 'Inshallah'] },
        correctAnswer: 2,
        explanation: { tr: 'Maşallah denir', nl: 'We zeggen "Mashallah" (wat Allah heeft gewild) bij iets moois om het boze oog te vermijden' }
      },
      {
        id: '7',
        question: { tr: 'Eve girerken hangi ayakla girilir?', nl: 'Met welke voet betreed je volgens de Sunnah je huis?' },
        options: { tr: ['Sol', 'Sağ', 'İkisi', 'Farketmez'], nl: ['Linkervoet', 'Rechtervoet', 'Beide', 'Maakt niet uit'] },
        correctAnswer: 1,
        explanation: { tr: 'Sağ ayakla girilir', nl: 'Volgens de Sunnah betreden we ons huis met de rechtervoet en zeggen Bismillah' }
      },
      {
        id: '8',
        question: { tr: 'Tuvaletten hangi ayakla çıkılır?', nl: 'Met welke voet verlaat je volgens de Sunnah het toilet?' },
        options: { tr: ['Sol', 'Sağ', 'İkisi', 'Farketmez'], nl: ['Linkervoet', 'Rechtervoet', 'Beide', 'Maakt niet uit'] },
        correctAnswer: 1,
        explanation: { tr: 'Sağ ayakla çıkılır', nl: 'Volgens de Sunnah verlaten we het toilet met de rechtervoet (en betreden het met links)' }
      },
      {
        id: '9',
        question: { tr: 'Komşuya nasıl davranılır?', nl: 'Hoe moeten we volgens de Islam omgaan met onze buren?' },
        options: { tr: ['Kötü', 'İyi', 'Kayıtsız', 'Kızgın'], nl: ['Slecht', 'Goed en vriendelijk', 'Onverschillig', 'Boos'] },
        correctAnswer: 1,
        explanation: { tr: 'Komşuya iyi davranılır', nl: 'We moeten goed en vriendelijk zijn tegen onze buren - de Profeet (vrede zij met hem) benadrukte dit vaak' }
      },
      {
        id: '10',
        question: { tr: 'Birisi hapşırınca ne denir?', nl: 'Wat zeg je wanneer iemand niest en Alhamdulillah zegt?' },
        options: { tr: ['Bismillah', 'Elhamdülillah', 'Yerhamükellah', 'Maşallah'], nl: ['Bismillah', 'Alhamdulillah', 'Yarhamukallah', 'Mashallah'] },
        correctAnswer: 2,
        explanation: { tr: 'Yerhamükellah denir', nl: 'We zeggen "Yarhamukallah" (moge Allah je genadig zijn) wanneer iemand niest en Alhamdulillah zegt' }
      }
    ]
  },
  {
    id: 'ramadan',
    title: { tr: 'Ramazan ve Oruç', nl: 'Ramadan en Vasten' },
    emoji: '🌙',
    color: 'cyan',
    questions: [
      {
        id: '1',
        question: { tr: 'Ramazan kaçıncı aydır?', nl: 'Welke maand is Ramadan in de islamitische kalender?' },
        options: { tr: ['7.', '8.', '9.', '10.'], nl: ['7e', '8e', '9e', '10e'] },
        correctAnswer: 2,
        explanation: { tr: 'Ramazan 9. aydır', nl: 'Ramadan is de 9e maand van de islamitische kalender' }
      },
      {
        id: '2',
        question: { tr: 'Oruç hangi vakitte açılır?', nl: 'Wanneer mag je je vasten verbreken (iftar)?' },
        options: { tr: ['Sabah', 'Öğle', 'İkindi', 'Akşam'], nl: ['Ochtend', 'Middag', 'Namiddag', 'Bij zonsondergang'] },
        correctAnswer: 3,
        explanation: { tr: 'Oruç akşam açılır', nl: 'Het vasten wordt verbroken bij zonsondergang met iftar (meestal met dadels en water)' }
      },
      {
        id: '3',
        question: { tr: 'Sahur ne zaman yenir?', nl: 'Wanneer eet je sahoor (de maaltijd voor het vasten)?' },
        options: { tr: ['Akşam', 'Gece', 'Sabah', 'Öğle'], nl: ['Avond', 'Nacht', 'Vroege ochtend voor zonsopgang', 'Middag'] },
        correctAnswer: 2,
        explanation: { tr: 'Sahur sabah yenir', nl: 'Sahoor wordt gegeten in de vroege ochtend vóór zonsopgang om kracht te krijgen voor het vasten' }
      },
      {
        id: '4',
        question: { tr: 'Kadir gecesi hangi aydadır?', nl: 'In welke maand is Laylatul Qadr (de Nacht van de Macht)?' },
        options: { tr: ['Şaban', 'Ramazan', 'Şevval', 'Zilhicce'], nl: ['Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul-Hijjah'] },
        correctAnswer: 1,
        explanation: { tr: 'Kadir gecesi Ramazan\'dadır', nl: 'Laylatul Qadr is in Ramadan, meestal gezocht in de laatste 10 nachten, vooral de oneven nachten' }
      },
      {
        id: '5',
        question: { tr: 'Ramazan\'dan sonra hangi bayram gelir?', nl: 'Welk feest komt na Ramadan?' },
        options: { tr: ['Kurban', 'Ramazan', 'Mevlid', 'Regaip'], nl: ['Offerfeest (Eid ul-Adha)', 'Suikerfeest (Eid ul-Fitr)', 'Mawlid', 'Raghaib'] },
        correctAnswer: 1,
        explanation: { tr: 'Ramazan Bayramı gelir', nl: 'Na Ramadan komt het Suikerfeest (Eid ul-Fitr) - een drie-daags feest' }
      },
      {
        id: '6',
        question: { tr: 'Oruç tutan ne yapmamalı?', nl: 'Wat mag je niet doen tijdens het vasten?' },
        options: { tr: ['Yemek', 'Namaz', 'Dua', 'Kur\'an'], nl: ['Eten en drinken', 'Bidden', 'Smeekbede doen', 'Koran lezen'] },
        correctAnswer: 0,
        explanation: { tr: 'Oruçlu yemek yemez', nl: 'Je mag niet eten of drinken tijdens het vasten van zonsopgang tot zonsondergang' }
      },
      {
        id: '7',
        question: { tr: 'Kadir gecesi bin aydan daha mı hayırlıdır?', nl: 'Is Laylatul Qadr (de nacht van de macht) beter dan duizend maanden?' },
        options: { tr: ['Hayır', 'Evet', 'Aynı', 'Bilmiyorum'], nl: ['Nee', 'Ja', 'Hetzelfde', 'Weet niet'] },
        correctAnswer: 1,
        explanation: { tr: 'Evet, bin aydan hayırlıdır', nl: 'Ja, Laylatul Qadr is beter dan duizend maanden - aanbidding in deze nacht is meer waard dan 83 jaar' }
      },
      {
        id: '8',
        question: { tr: 'İftar ne ile açılır?', nl: 'Waarmee is het Sunnah om je vasten te verbreken?' },
        options: { tr: ['Ekmek', 'Hurma', 'Pirinç', 'Et'], nl: ['Brood', 'Dadels', 'Rijst', 'Vlees'] },
        correctAnswer: 1,
        explanation: { tr: 'İftar hurma ile açılır', nl: 'Volgens de Sunnah van Profeet Mohammed (vrede zij met hem) verbreken we het vasten met dadels en water' }
      },
      {
        id: '9',
        question: { tr: 'Ramazan kaç gün sürer?', nl: 'Hoeveel dagen duurt Ramadan?' },
        options: { tr: ['28', '29 veya 30', '31', '40'], nl: ['28', '29 of 30', '31', '40'] },
        correctAnswer: 1,
        explanation: { tr: 'Ramazan 29 veya 30 gün sürer', nl: 'Ramadan duurt 29 of 30 dagen, afhankelijk van het zien van de nieuwe maan' }
      },
      {
        id: '10',
        question: { tr: 'Teravih namazı ne zaman kılınır?', nl: 'Wanneer wordt het Tarawih gebed verricht?' },
        options: { tr: ['Sabah', 'Öğle', 'Akşam', 'Yatsı'], nl: ['Ochtend', 'Middag', 'Avond', 'Na het Isha gebed'] },
        correctAnswer: 3,
        explanation: { tr: 'Teravih yatsıdan sonra kılınır', nl: 'Het Tarawih gebed wordt verricht na het Isha (nacht) gebed tijdens Ramadan' }
      }
    ]
  },
  {
    id: 'hajj',
    title: { tr: 'Hac İbadeti', nl: 'De Bedevaart' },
    emoji: '🕋',
    color: 'gray',
    questions: [
      {
        id: '1',
        question: { tr: 'Hac hangi ayda yapılır?', nl: 'In welke maand wordt de Hadj verricht?' },
        options: { tr: ['Ramazan', 'Şevval', 'Zilhicce', 'Muharrem'], nl: ['Ramadan', 'Shawwal', 'Dhul-Hijjah', 'Muharram'] },
        correctAnswer: 2,
        explanation: { tr: 'Hac Zilhicce ayında yapılır', nl: 'De Hadj wordt verricht in de maand Dhul-Hijjah (de 12e maand)' }
      },
      {
        id: '2',
        question: { tr: 'Hac kaç defa farzdır?', nl: 'Hoe vaak is de Hadj verplicht in je leven?' },
        options: { tr: ['Her yıl', 'Ömürde 1 kez', '5 kez', '10 kez'], nl: ['Elk jaar', '1 keer in je leven', '5 keer', '10 keer'] },
        correctAnswer: 1,
        explanation: { tr: 'Hac ömürde 1 kez farzdır', nl: 'De Hadj is verplicht één keer in je leven als je fysiek en financieel in staat bent' }
      },
      {
        id: '3',
        question: { tr: 'Hac\'da Kabe kaç kez tavaf edilir?', nl: 'Hoeveel keer loop je rond de Ka\'aba tijdens Tawaf?' },
        options: { tr: ['3', '5', '7', '10'], nl: ['3', '5', '7', '10'] },
        correctAnswer: 2,
        explanation: { tr: 'Kabe 7 kez tavaf edilir', nl: 'Je loopt 7 keer tegen de klok in rond de Ka\'aba tijdens Tawaf' }
      },
      {
        id: '4',
        question: { tr: 'Safa ile Merve arası kaç kez gidilir?', nl: 'Hoeveel keer loop je tussen Safa en Marwa tijdens Sa\'i?' },
        options: { tr: ['3', '5', '7', '10'], nl: ['3', '5', '7', '10'] },
        correctAnswer: 2,
        explanation: { tr: 'Safa-Merve arası 7 kez gidilir', nl: 'Je loopt 7 keer tussen de heuvels Safa en Marwa tijdens het ritueel Sa\'i' }
      },
      {
        id: '5',
        question: { tr: 'Vakfe nerede yapılır?', nl: 'Waar vind de belangrijkste ceremonie van Hajj plaats (Wuquf)?' },
        options: { tr: ['Mina', 'Arafat', 'Müzdelife', 'Mekke'], nl: ['Mina', 'Berg Arafat', 'Muzdalifah', 'Mekka'] },
        correctAnswer: 1,
        explanation: { tr: 'Vakfe Arafat\'ta yapılır', nl: 'Wuquf (het belangrijkste ritueel van Hajj) vindt plaats bij de berg Arafat op de 9e dag van Dhul-Hijjah' }
      },
      {
        id: '6',
        question: { tr: 'Hac için giyilen özel giysi nedir?', nl: 'Wat is de speciale kleding die gedragen wordt tijdens de Hadj?' },
        options: { tr: ['Cübbe', 'İhram', 'Sarık', 'Takke'], nl: ['Jalabiya', 'Ihram (twee witte ongenaaide doeken)', 'Tulband', 'Takke'] },
        correctAnswer: 1,
        explanation: { tr: 'İhram giyilir', nl: 'Mannen dragen Ihram (twee witte ongenaaide doeken) en vrouwen dragen bescheiden kleding' }
      },
      {
        id: '7',
        question: { tr: 'Şeytan taşlama nerededir?', nl: 'Waar vind het stenigen van de pilaren (Jamarat) plaats?' },
        options: { tr: ['Mekke', 'Medine', 'Mina', 'Arafat'], nl: ['Mekka', 'Medina', 'Mina', 'Arafat'] },
        correctAnswer: 2,
        explanation: { tr: 'Şeytan taşlama Mina\'dadır', nl: 'Het stenigen van de pilaren (Jamarat) vindt plaats in Mina - dit symboliseert het verwerpen van de duivel' }
      },
      {
        id: '8',
        question: { tr: 'Zemzem suyu nerededir?', nl: 'Waar komt het heilige Zamzam water vandaan?' },
        options: { tr: ['Medine', 'Mekke', 'Taif', 'Cidde'], nl: ['Medina', 'Mekka', 'Taif', 'Jeddah'] },
        correctAnswer: 1,
        explanation: { tr: 'Zemzem Mekke\'dedir', nl: 'De Zamzam bron bevindt zich in Mekka bij de Ka\'aba - het is een heilige waterbron die nooit opdroogt' }
      },
      {
        id: '9',
        question: { tr: 'Kurban Bayramı kaç gün sürer?', nl: 'Hoeveel dagen duurt het Offerfeest (Eid ul-Adha)?' },
        options: { tr: ['2', '3', '4', '5'], nl: ['2', '3', '4', '5'] },
        correctAnswer: 2,
        explanation: { tr: 'Kurban Bayramı 4 gün sürer', nl: 'Het Offerfeest (Eid ul-Adha) duurt 4 dagen en vindt plaats tijdens de Hadj' }
      },
      {
        id: '10',
        question: { tr: 'Hacdan sonra ne denir?', nl: 'Welke eretitel krijg je na het voltooien van de Hadj?' },
        options: { tr: ['Hafız', 'Hoca', 'Hacı', 'İmam'], nl: ['Hafiz', 'Hoca', 'Hadji', 'Imam'] },
        correctAnswer: 2,
        explanation: { tr: 'Hacdan sonra Hacı denir', nl: 'Na het voltooien van de Hadj mag je de eretitel "Hadji" (pelgrim) dragen' }
      }
    ]
  },
  {
    id: 'months',
    title: { tr: 'İslami Aylar', nl: 'Islamitische Maanden' },
    emoji: '📅',
    color: 'red',
    questions: [
      {
        id: '1',
        question: { tr: 'İslami takvimde ilk ay hangisidir?', nl: 'Wat is de eerste maand van de islamitische kalender?' },
        options: { tr: ['Ramazan', 'Muharrem', 'Safer', 'Rebiülevvel'], nl: ['Ramadan', 'Muharram', 'Safar', 'Rabi al-Awwal'] },
        correctAnswer: 1,
        explanation: { tr: 'Muharrem ilk aydır', nl: 'Muharram is de eerste maand van de islamitische kalender en is een heilige maand' }
      },
      {
        id: '2',
        question: { tr: 'Hz. Muhammed (s.a.v.) hangi ayda doğdu?', nl: 'In welke maand werd Profeet Mohammed (vrede zij met hem) geboren?' },
        options: { tr: ['Muharrem', 'Safer', 'Rebiülevvel', 'Ramazan'], nl: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Ramadan'] },
        correctAnswer: 2,
        explanation: { tr: 'Rebiülevvel ayında doğdu', nl: 'Profeet Mohammed (vrede zij met hem) werd geboren in de maand Rabi al-Awwal' }
      },
      {
        id: '3',
        question: { tr: 'Hangi ay mübarek kabul edilir?', nl: 'Welke maand is de meest heilige maand?' },
        options: { tr: ['Safer', 'Ramazan', 'Şevval', 'Zilkade'], nl: ['Safar', 'Ramadan', 'Shawwal', 'Dhul-Qa\'dah'] },
        correctAnswer: 1,
        explanation: { tr: 'Ramazan mübarek aydır', nl: 'Ramadan is de meest heilige maand waarin de Koran werd geopenbaard en waarin vasten verplicht is' }
      },
      {
        id: '4',
        question: { tr: 'Hac ayı hangisidir?', nl: 'In welke maand wordt de Hadj verricht?' },
        options: { tr: ['Ramazan', 'Şevval', 'Zilhicce', 'Muharrem'], nl: ['Ramadan', 'Shawwal', 'Dhul-Hijjah', 'Muharram'] },
        correctAnswer: 2,
        explanation: { tr: 'Zilhicce hac ayıdır', nl: 'Dhul-Hijjah is de 12e maand waarin de Hadj plaatsvindt' }
      },
      {
        id: '5',
        question: { tr: 'İslami takvim kaç aya sahiptir?', nl: 'Hoeveel maanden heeft de islamitische kalender?' },
        options: { tr: ['10', '11', '12', '13'], nl: ['10', '11', '12', '13'] },
        correctAnswer: 2,
        explanation: { tr: '12 ay vardır', nl: 'De islamitische kalender heeft 12 maanden, net als de Gregoriaanse kalender' }
      },
      {
        id: '6',
        question: { tr: 'Aşure günü hangi aydadır?', nl: 'In welke maand valt de dag van Ashura?' },
        options: { tr: ['Muharrem', 'Safer', 'Ramazan', 'Şaban'], nl: ['Muharram', 'Safar', 'Ramadan', 'Sha\'ban'] },
        correctAnswer: 0,
        explanation: { tr: 'Aşure Muharrem ayındadır', nl: 'De dag van Ashura valt op de 10e dag van Muharram - een belangrijke dag van vasten' }
      },
      {
        id: '7',
        question: { tr: 'Regaip kandili hangi aydadır?', nl: 'In welke maand is Raghaib?' },
        options: { tr: ['Muharrem', 'Recep', 'Şaban', 'Ramazan'], nl: ['Muharram', 'Rajab', 'Sha\'ban', 'Ramadan'] },
        correctAnswer: 1,
        explanation: { tr: 'Regaip Recep ayındadır', nl: 'Raghaib is in de maand Rajab - een heilige maand' }
      },
      {
        id: '8',
        question: { tr: 'Berat kandili hangi aydadır?', nl: 'In welke maand is Bara\'ah (de Nacht van Vergiffenis)?' },
        options: { tr: ['Recep', 'Şaban', 'Ramazan', 'Şevval'], nl: ['Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal'] },
        correctAnswer: 1,
        explanation: { tr: 'Berat Şaban ayındadır', nl: 'Bara\'ah (de Nacht van Vergiffenis) is in de maand Sha\'ban, de maand vóór Ramadan' }
      },
      {
        id: '9',
        question: { tr: 'Mirac kandili hangi aydadır?', nl: 'In welke maand is Mi\'raj (de Nachtelijke Reis)?' },
        options: { tr: ['Muharrem', 'Recep', 'Şaban', 'Ramazan'], nl: ['Muharram', 'Rajab', 'Sha\'ban', 'Ramadan'] },
        correctAnswer: 1,
        explanation: { tr: 'Mirac Recep ayındadır', nl: 'Mi\'raj (de Nachtelijke Reis van de Profeet vrede zij met hem) wordt herdacht in Rajab' }
      },
      {
        id: '10',
        question: { tr: 'Hicri takvim neye göredir?', nl: 'Waarop is de islamitische kalender gebaseerd?' },
        options: { tr: ['Güneşe', 'Aya', 'Yıldızlara', 'Mevsime'], nl: ['Zon', 'Maan', 'Sterren', 'Seizoen'] },
        correctAnswer: 1,
        explanation: { tr: 'Hicri takvim aya göredir', nl: 'De islamitische (Hijri) kalender is een maankalender gebaseerd op de maanfasen' }
      }
    ]
  },
  {
    id: 'companions',
    title: { tr: 'Sahabeler', nl: 'Metgezellen van de Profeet' },
    emoji: '👥',
    color: 'teal',
    questions: [
      {
        id: '1',
        question: { tr: 'Hz. Muhammed\'in (s.a.v.) en yakın dostu kimdir?', nl: 'Wie was de beste vriend van Profeet Mohammed (vrede zij met hem)?' },
        options: { tr: ['Hz. Ömer', 'Hz. Ebubekir', 'Hz. Osman', 'Hz. Ali'], nl: ['Omar', 'Abu Bakr', 'Uthman', 'Ali'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Ebubekir en yakın dostuydu', nl: 'Abu Bakr (moge Allah tevreden zijn met hem) was de beste vriend van de Profeet en de eerste man die de Islam accepteerde' }
      },
      {
        id: '2',
        question: { tr: 'İlk halife kimdir?', nl: 'Wie was de eerste khalifa (leider) na Profeet Mohammed (vrede zij met hem)?' },
        options: { tr: ['Hz. Ömer', 'Hz. Ebubekir', 'Hz. Osman', 'Hz. Ali'], nl: ['Omar', 'Abu Bakr', 'Uthman', 'Ali'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Ebubekir ilk halifedir', nl: 'Abu Bakr (moge Allah tevreden zijn met hem) was de eerste khalifa (leider) na de Profeet' }
      },
      {
        id: '3',
        question: { tr: 'Kur\'an\'ı toplayan halife kimdir?', nl: 'Welke khalifa liet de Koran verzamelen en samenstellen in boekvorm?' },
        options: { tr: ['Hz. Ebubekir', 'Hz. Ömer', 'Hz. Osman', 'Hz. Ali'], nl: ['Abu Bakr', 'Omar', 'Uthman', 'Ali'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Osman Kur\'an\'ı kitap haline getirdi', nl: 'Khalifa Uthman (moge Allah tevreden zijn met hem) liet de Koran verzamelen en samenstellen in één standaard boek' }
      },
      {
        id: '4',
        question: { tr: 'Hz. Muhammed\'in (s.a.v.) kızı kimdir?', nl: 'Wat is de naam van de beroemde dochter van Profeet Mohammed (vrede zij met hem)?' },
        options: { tr: ['Ayşe', 'Hatice', 'Fatıma', 'Zeynep'], nl: ['Aisha', 'Khadijah', 'Fatima', 'Zaynab'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Fatıma kızıdır', nl: 'Fatima (moge Allah tevreden zijn met haar) was de geliefde dochter van de Profeet' }
      },
      {
        id: '5',
        question: { tr: 'Hz. Fatıma\'nın eşi kimdir?', nl: 'Wie was de echtgenoot van Fatima (moge Allah tevreden zijn met haar)?' },
        options: { tr: ['Hz. Ömer', 'Hz. Ebubekir', 'Hz. Osman', 'Hz. Ali'], nl: ['Omar', 'Abu Bakr', 'Uthman', 'Ali'] },
        correctAnswer: 3,
        explanation: { tr: 'Hz. Ali eşidir', nl: 'Ali (moge Allah tevreden zijn met hem) was de echtgenoot van Fatima en de vierde khalifa' }
      },
      {
        id: '6',
        question: { tr: 'Hz. Muhammed\'in (s.a.v.) ilk eşi kimdir?', nl: 'Wie was de eerste echtgenote van Profeet Mohammed (vrede zij met hem)?' },
        options: { tr: ['Ayşe', 'Hatice', 'Hafsa', 'Sevde'], nl: ['Aisha', 'Khadijah', 'Hafsah', 'Sawdah'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Hatice ilk eşidir', nl: 'Khadijah (moge Allah tevreden zijn met haar) was zijn eerste echtgenote die hem steunde toen hij profeet werd' }
      },
      {
        id: '7',
        question: { tr: 'Ezan\'ı ilk okuyan kimdir?', nl: 'Wie was de eerste muezzin (oproeper tot gebed) in de Islam?' },
        options: { tr: ['Bilal-i Habeşi', 'Hz. Ömer', 'Hz. Ali', 'Hz. Ebubekir'], nl: ['Bilal', 'Omar', 'Ali', 'Abu Bakr'] },
        correctAnswer: 0,
        explanation: { tr: 'Bilal-i Habeşi ilk müezzindir', nl: 'Bilal (moge Allah tevreden zijn met hem) was de eerste muezzin met zijn prachtige stem' }
      },
      {
        id: '8',
        question: { tr: 'İki kızını Hz. Muhammed\'e (s.a.v.) veren sahabi kimdir?', nl: 'Welke metgezel gaf twee van zijn dochters in huwelijk aan de Profeet (vrede zij met hem)?' },
        options: { tr: ['Hz. Ebubekir', 'Hz. Ömer', 'Hz. Osman', 'Hz. Ali'], nl: ['Abu Bakr', 'Omar', 'Uthman', 'Ali'] },
        correctAnswer: 1,
        explanation: { tr: 'Hz. Ömer iki kızını verdi', nl: 'Omar (moge Allah tevreden zijn met hem) gaf twee van zijn dochters in huwelijk aan de Profeet' }
      },
      {
        id: '9',
        question: { tr: 'Allah\'ın aslanı lakabı kime verildi?', nl: 'Wie kreeg de titel "Leeuw van Allah"?' },
        options: { tr: ['Hz. Ömer', 'Hz. Hamza', 'Hz. Ali', 'Hz. Ebubekir'], nl: ['Omar', 'Hamza', 'Ali', 'Abu Bakr'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Ali\'ye verildi', nl: 'Ali (moge Allah tevreden zijn met hem) kreeg de titel "Leeuw van Allah" vanwege zijn moed' }
      },
      {
        id: '10',
        question: { tr: 'Hz. Muhammed\'in (s.a.v.) amcası kimdir?', nl: 'Wie was de oom van Profeet Mohammed (vrede zij met hem) die martelaar werd?' },
        options: { tr: ['Ebu Cehil', 'Ebu Leheb', 'Hz. Hamza', 'Ebu Talip'], nl: ['Abu Jahl', 'Abu Lahab', 'Hamza', 'Abu Talib'] },
        correctAnswer: 2,
        explanation: { tr: 'Hz. Hamza amcasıdır', nl: 'Hamza (moge Allah tevreden zijn met hem) was de oom van de Profeet en werd martelaar in de Slag van Uhud' }
      }
    ]
  }
];

export default function IslamicTrivia({ language, onBack }: IslamicTriviaProps) {
  const [selectedTheme, setSelectedTheme] = useState<TriviaTheme | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const translations = {
    tr: {
      title: 'İslami Bilgi Yarışması',
      subtitle: 'Bir tema seç ve bilginizi test edin',
      selectTheme: 'Tema Seç',
      question: 'Soru',
      of: '/',
      checkAnswer: 'Cevabı Kontrol Et',
      nextQuestion: 'Sonraki Soru',
      correct: 'Doğru!',
      incorrect: 'Yanlış',
      score: 'Puan',
      explanation: 'A??klama',
      completed: 'Tebrikler! T?m sorular? tamamlad?n?z!',
      yourScore: 'Skorunuz',
      restart: 'Yeniden Ba?la',
      backToThemes: 'Temalara D?n',
      back: 'Geri D?n'
    },
    nl: {
      title: 'Islamitische Trivia',
      subtitle: 'Kies een thema en test je kennis',
      selectTheme: 'Kies Thema',
      question: 'Vraag',
      of: 'van',
      checkAnswer: 'Controleer Antwoord',
      nextQuestion: 'Volgende Vraag',
      correct: 'Correct!',
      incorrect: 'Onjuist',
      score: 'Score',
      explanation: 'Uitleg',
      completed: 'Gefeliciteerd! Je hebt alle vragen beantwoord!',
      yourScore: 'Je score',
      restart: 'Opnieuw',
      backToThemes: 'Terug naar Thema\'s',
      back: 'Terug'
    }
  };

  const t = translations[language];

  const handleThemeSelect = (theme: TriviaTheme) => {
    setSelectedTheme(theme);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(theme.questions.length).fill(false));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !selectedTheme) return;

    const correct = selectedAnswer === selectedTheme.questions[currentQuestion].correctAnswer;
    if (correct && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
  if (!selectedTheme) {
    return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => onBack?.()}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-purple-600 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {triviaThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${getColorClass(theme.color)} rounded-full mb-4`}>
                  <span className="text-3xl">{theme.emoji}</span>
                </div>
                <h3 className="text-gray-800 mb-2">{theme.title[language]}</h3>
                <p className="text-gray-600 text-sm">{theme.questions.length} {t.question}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

    if (currentQuestion < selectedTheme.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    if (selectedTheme) {
      setAnsweredQuestions(new Array(selectedTheme.questions.length).fill(false));
    }
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      amber: 'bg-amber-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500',
      cyan: 'bg-cyan-500',
      gray: 'bg-gray-500',
      red: 'bg-red-500',
      teal: 'bg-teal-500'
    };
    return colors[color] || 'bg-purple-500';
  };

  if (!selectedTheme) {
      return (
        <div className="min-h-screen" style={{ backgroundColor: '#e6f4ff' }}>
          <div className="max-w-6xl mx-auto">
            {onBack && (
              <div className="mb-4">
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.back}
                </button>
              </div>
            )}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            <h1 className="text-purple-600 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {triviaThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${getColorClass(theme.color)} rounded-full mb-4`}>
                  <span className="text-3xl">{theme.emoji}</span>
                </div>
                <h3 className="text-gray-800 mb-2">{theme.title[language]}</h3>
                <p className="text-gray-600 text-sm">{theme.questions.length} {t.question}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = selectedTheme.questions[currentQuestion];
  const isCompleted = currentQuestion === selectedTheme.questions.length - 1 && showExplanation;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#e6f4ff' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center">
            <button
              onClick={handleBackToThemes}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'tr' ? 'Geri Dön' : 'Terug'}
            </button>
          </div>

        <div className="rounded-2xl shadow-none border border-blue-100 p-6 md:p-8 bg-white" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getColorClass(selectedTheme.color)} rounded-full flex items-center justify-center`}>
                <span className="text-2xl">{selectedTheme.emoji}</span>
              </div>
              <div>
                <h2 className="text-gray-800">{selectedTheme.title[language]}</h2>
                <p className="text-gray-600 text-sm">
                  {t.question} {currentQuestion + 1} {t.of} {selectedTheme.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{t.score}: {score}/{selectedTheme.questions.length}</span>
            </div>
          </div>

          {!isCompleted ? (
            <>
              <div className="mb-6">
                <p className="text-gray-800 text-lg mb-6">{currentQ.question[language]}</p>

                <div className="space-y-3">
                  {currentQ.options[language].map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQ.correctAnswer;
                    const showResult = showExplanation;

                    let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all ';
                    if (!showResult) {
                      buttonClass += isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50';
                    } else {
                      if (isCorrect) {
                        buttonClass += 'border-green-500 bg-green-50';
                      } else if (isSelected && !isCorrect) {
                        buttonClass += 'border-red-500 bg-red-50';
                      } else {
                        buttonClass += 'border-gray-200 bg-gray-50';
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800">{option}</span>
                          {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {showExplanation && (
                <div className={`p-4 rounded-xl mb-6 ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-50 border-2 border-green-200' : ''}`} style={selectedAnswer === currentQ.correctAnswer ? undefined : { backgroundColor: '#e6f4ff', border: '2px solid #bfdbfe' }}>
                  <div className="flex items-start gap-3">
                    {selectedAnswer === currentQ.correctAnswer ? (
                      <Award className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className={`mb-2 ${selectedAnswer === currentQ.correctAnswer ? 'text-green-700' : 'text-blue-700'}`}>
                        {selectedAnswer === currentQ.correctAnswer ? t.correct : t.incorrect}
                      </p>
                      <p className="text-gray-700">{t.explanation}: {currentQ.explanation[language]}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {!showExplanation ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 text-white py-3 rounded-xl transition-all disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#9810fa', color: '#fff' }}
                  >
                    {t.checkAnswer}
                  </button>
                ) : currentQuestion < selectedTheme.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 text-white py-3 rounded-xl transition-all"
                    style={{ backgroundColor: '#9810fa', color: '#fff' }}
                  >
                    {t.nextQuestion}
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-gray-800 mb-4">{t.completed}</h2>
              <p className="text-gray-600 text-xl mb-6">
                {t.yourScore}: {score}/{selectedTheme.questions.length}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  {t.restart}
                </button>
                <button
                  onClick={handleBackToThemes}
                  className="px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-all"
                >
                  {t.backToThemes}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
