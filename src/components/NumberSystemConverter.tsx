import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type NumberSystem = 'binary' | 'octal' | 'decimal' | 'hexadecimal';

const NumberSystemConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputSystem, setInputSystem] = useState<NumberSystem>('decimal');
  const [results, setResults] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  });

  const validateInput = (value: string, system: NumberSystem): boolean => {
    if (!value) return false;

    switch (system) {
      case 'binary':
        return /^[01]+$/.test(value);
      case 'octal':
        return /^[0-7]+$/.test(value);
      case 'decimal':
        return /^\d+$/.test(value);
      case 'hexadecimal':
        return /^[0-9A-Fa-f]+$/.test(value);
      default:
        return false;
    }
  };

  const convert = () => {
    if (!validateInput(inputValue, inputSystem)) {
      setResults({
        binary: 'Ungültige Eingabe',
        octal: 'Ungültige Eingabe',
        decimal: 'Ungültige Eingabe',
        hexadecimal: 'Ungültige Eingabe'
      });
      return;
    }

    let decimalValue: number;

    switch (inputSystem) {
      case 'binary':
        decimalValue = parseInt(inputValue, 2);
        break;
      case 'octal':
        decimalValue = parseInt(inputValue, 8);
        break;
      case 'decimal':
        decimalValue = parseInt(inputValue, 10);
        break;
      case 'hexadecimal':
        decimalValue = parseInt(inputValue, 16);
        break;
      default:
        return;
    }

    if (isNaN(decimalValue) || decimalValue < 0) {
      setResults({
        binary: 'Fehler',
        octal: 'Fehler',
        decimal: 'Fehler',
        hexadecimal: 'Fehler'
      });
      return;
    }

    setResults({
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      decimal: decimalValue.toString(10),
      hexadecimal: decimalValue.toString(16).toUpperCase()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Zahlensystem Konverter</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            Eingabesystem
          </label>
          <select
            value={inputSystem}
            onChange={(e) => setInputSystem(e.target.value as NumberSystem)}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="binary">Binär (Basis 2)</option>
            <option value="octal">Oktal (Basis 8)</option>
            <option value="decimal">Dezimal (Basis 10)</option>
            <option value="hexadecimal">Hexadezimal (Basis 16)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            Eingabewert
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Geben Sie eine Zahl ein..."
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            {inputSystem === 'binary' && 'Nur 0 und 1 erlaubt'}
            {inputSystem === 'octal' && 'Nur 0-7 erlaubt'}
            {inputSystem === 'decimal' && 'Nur 0-9 erlaubt'}
            {inputSystem === 'hexadecimal' && 'Nur 0-9 und A-F erlaubt'}
          </p>
        </div>

        <button
          onClick={convert}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Konvertieren
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="border-t border-slate-700 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Ergebnisse</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">Binär (Basis 2)</div>
            <div className="text-lg text-white font-mono break-all">
              {results.binary || '-'}
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">Oktal (Basis 8)</div>
            <div className="text-lg text-white font-mono break-all">
              {results.octal || '-'}
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">Dezimal (Basis 10)</div>
            <div className="text-lg text-white font-mono break-all">
              {results.decimal || '-'}
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">Hexadezimal (Basis 16)</div>
            <div className="text-lg text-white font-mono break-all">
              {results.hexadecimal || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSystemConverter;
