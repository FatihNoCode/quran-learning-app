import { Mic, X } from 'lucide-react';
import BookIcon from './icons/BookIcon';
import BadgeIcon from './icons/BadgeIcon';
import GrowthIcon from './icons/GrowthIcon';

interface WelcomeGuideProps {
  role: 'student' | 'teacher';
  language: 'tr' | 'nl';
  onClose: () => void;
}

const translations = {
  tr: {
    student: {
      title: 'Hoş Geldin! 🎉',
      subtitle: 'Arapça okuma yolculuğuna başlayalım!',
      steps: [
        {
        icon: BookIcon,
          title: 'Derslerle Öğren',
          description: 'Her ders bir harf veya kural öğretir. Sırayla ilerle!'
        },
        {
          icon: Mic,
          title: 'Telaffuz Pratiği Yap',
          description: 'Mikrofona konuşarak telaffuzunu geliştir!'
        },
        {
          icon: BadgeIcon,
          title: 'Tekrar Et',
          description: 'Öğrendiklerini unutma! Tekrar sistemi sana yardımcı olur.'
        },
        {
          icon: GrowthIcon,
          title: 'İlerle ve Geliş!',
          description: 'Her seviyeyi tamamla ve Kuran okumayı öğren!'
        }
      ],
      start: 'Başlayalım!'
    },
    teacher: {
      title: 'Hoş Geldiniz! 👋',
      subtitle: 'Öğrenci ilerlemelerini takip edin',
      steps: [
        {
        icon: BookIcon,
          title: 'Öğrenci Listesi',
          description: 'Tüm öğrencilerinizi ve ilerlemelerini görün'
        },
        {
          icon: GrowthIcon,
          title: 'İstatistikler',
          description: 'Ortalama ilerleme ve aktiviteyi takip edin'
        },
        {
          icon: BadgeIcon,
          title: 'Seviye Dağılımı',
          description: 'Hangi öğrencinin hangi seviyede olduğunu görün'
        }
      ],
      start: 'Panele Git'
    }
  },
  nl: {
    student: {
      title: 'Welkom! 🎉',
      subtitle: 'Laten we beginnen met je Arabische leerreis!',
      steps: [
        {
        icon: BookIcon,
          title: 'Leer met Lessen',
          description: 'Elke les leert een letter of regel. Ga stap voor stap!'
        },
        {
          icon: Mic,
          title: 'Oefen Uitspraak',
          description: 'Verbeter je uitspraak door in de microfoon te spreken!'
        },
        {
          icon: BadgeIcon,
          title: 'Herhaal',
          description: 'Vergeet niet wat je hebt geleerd! Het herhalingssysteem helpt je.'
        },
        {
          icon: GrowthIcon,
          title: 'Vooruitgang en Groei!',
          description: 'Voltooi elk niveau en leer de Koran te lezen!'
        }
      ],
      start: 'Laten we beginnen!'
    },
    teacher: {
      title: 'Welkom! 👋',
      subtitle: 'Volg de voortgang van studenten',
      steps: [
        {
        icon: BookIcon,
          title: 'Studentenlijst',
          description: 'Zie al je studenten en hun voortgang'
        },
        {
          icon: GrowthIcon,
          title: 'Statistieken',
          description: 'Volg gemiddelde voortgang en activiteit'
        },
        {
          icon: BadgeIcon,
          title: 'Niveau Verdeling',
          description: 'Zie welke student op welk niveau is'
        }
      ],
      start: 'Naar Dashboard'
    }
  }
};

export default function WelcomeGuide({ role, language, onClose }: WelcomeGuideProps) {
  const content = translations[language][role];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-purple-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h1 className="mb-1">{content.title}</h1>
          <p className="text-purple-100 text-sm">{content.subtitle}</p>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-4">
          {content.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex gap-3 items-start p-3 bg-purple-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg flex-shrink-0">
                  <Icon className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-800 mb-1 text-sm">{step.title}</h3>
                  <p className="text-gray-600 text-xs">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105 active:scale-95"
          >
            {content.start}
          </button>
        </div>
      </div>
    </div>
  );
}
