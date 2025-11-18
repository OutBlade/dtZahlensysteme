import { useState } from 'react';
import { Calculator, Binary, Hash, Zap } from 'lucide-react';
import NumberSystemConverter from './components/NumberSystemConverter';
import StibitzCodeConverter from './components/StibitzCodeConverter';
import BCDConverter from './components/BCDConverter';
import ArithmeticCalculator from './components/ArithmeticCalculator';
import FloatingPointConverter from './components/FloatingPointConverter';

function App() {
  const [activeTab, setActiveTab] = useState<'number' | 'stibitz' | 'bcd' | 'arithmetic' | 'floating'>('number');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Digitaltechnik Rechner
            </h1>
          </div>
          <p className="text-blue-200 text-lg">
            Zahlensystem-Konverter für Binär, Oktal, Dezimal, Hexadezimal, Stibitz-Code und BCD
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
              Zahlensysteme
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
              Stibitz-Code
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
              BCD-Code
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
              Arithmetik
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
              Fließkomma
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
          <p>Digitaltechnik Werkzeuge für Informatik und Elektrotechnik</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
