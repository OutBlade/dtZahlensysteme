import { useState } from 'react';
import { Calculator, Binary, Hash, Zap } from 'lucide-react';
import NumberSystemConverter from './components/NumberSystemConverter';
import StibitzCodeConverter from './components/StibitzCodeConverter';
import BCDConverter from './components/BCDConverter';
import ArithmeticCalculator from './components/ArithmeticCalculator';
import FloatingPointConverter from './components/FloatingPointConverter';
import { LanguageContext } from './LanguageContext';
import { translations, Language } from './i18n';

function App() {
  const [activeTab, setActiveTab] = useState<'number' | 'stibitz' | 'bcd' | 'arithmetic' | 'floating'>('number');
  const [language, setLanguage] = useState<Language>('de');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12 relative">
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <span className={`text-sm font-semibold ${language === 'de' ? 'text-white' : 'text-slate-500'}`}>DE</span>
              <button
                onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                className="relative w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                style={{ backgroundColor: language === 'en' ? '#3b82f6' : '#475569' }}
                aria-label="Toggle language"
              >
                <span
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ transform: language === 'en' ? 'translateX(28px)' : 'translateX(0)' }}
                />
              </button>
              <span className={`text-sm font-semibold ${language === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-12 h-12 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {t.appTitle}
              </h1>
            </div>
            <p className="text-blue-200 text-lg">
              {t.appSubtitle}
            </p>
          </header>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <button
                onClick={() => setActiveTab('number')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'number'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Hash className="w-5 h-5" />
                {t.tabNumber}
              </button>
              <button
                onClick={() => setActiveTab('stibitz')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'stibitz'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Binary className="w-5 h-5" />
                {t.tabStibitz}
              </button>
              <button
                onClick={() => setActiveTab('bcd')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'bcd'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Calculator className="w-5 h-5" />
                {t.tabBcd}
              </button>
              <button
                onClick={() => setActiveTab('arithmetic')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'arithmetic'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Calculator className="w-5 h-5" />
                {t.tabArithmetic}
              </button>
              <button
                onClick={() => setActiveTab('floating')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'floating'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Zap className="w-5 h-5" />
                {t.tabFloating}
              </button>
            </div>

            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
              {activeTab === 'number' && <NumberSystemConverter />}
              {activeTab === 'stibitz' && <StibitzCodeConverter />}
              {activeTab === 'bcd' && <BCDConverter />}
              {activeTab === 'arithmetic' && <ArithmeticCalculator />}
              {activeTab === 'floating' && <FloatingPointConverter />}
            </div>
          </div>

          <footer className="text-center mt-12 text-slate-400">
            <p>{t.footer}</p>
          </footer>
        </div>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
