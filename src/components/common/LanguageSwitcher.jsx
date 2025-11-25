import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

// Vietnam Flag Icon
const VietnamFlag = ({ className = "w-6 h-4" }) => (
  <svg className={className} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#DA251D"/>
    <polygon points="15,4 16.5,9 21.5,9 17.5,12 19,17 15,14 11,17 12.5,12 8.5,9 13.5,9" fill="#FFFF00"/>
  </svg>
);

// England Flag Icon
const EnglandFlag = ({ className = "w-6 h-4" }) => (
  <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#FFF" strokeWidth="10"/>
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const isVietnamese = i18n.language === 'vi';

  const toggleLanguage = () => {
    const newLang = isVietnamese ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-4 py-2 bg-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
      style={{
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #9333ea)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}
      aria-label="Change language"
    >
      <Languages className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 text-blue-600" />
      
      <div className="relative w-7 h-5 overflow-hidden">
        <span 
          className={`absolute inset-0 flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
            isVietnamese 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-full opacity-0'
          }`}
        >
          VI 
        </span>
        <span 
          className={`absolute inset-0 flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
            !isVietnamese 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
        >
          EN
        </span>
      </div>

      <div className="relative w-6 h-5 overflow-hidden">
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isVietnamese 
              ? 'translate-x-0 opacity-100 scale-100' 
              : 'translate-x-full opacity-0 scale-50'
          }`}
        >
          <VietnamFlag className="w-6 h-4 rounded-sm shadow-sm" />
        </div>
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            !isVietnamese 
              ? 'translate-x-0 opacity-100 scale-100' 
              : '-translate-x-full opacity-0 scale-50'
          }`}
        >
          <EnglandFlag className="w-6 h-4 rounded-sm shadow-sm" />
        </div>
      </div>
    </button>
  );
};

export default LanguageSwitcher;
