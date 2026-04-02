import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type NumberSystem = 'binary' | 'octal' | 'decimal' | 'hexadecimal';

const NumberSystemConverter = () => {
  const { t } = useLanguage();
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
      case 'binary': return /^[01]+$/.test(value);
      case 'octal': return /^[0-7]+$/.test(value);
      case 'decimal': return /^\d+$/.test(value);
      case 'hexadecimal': return /^[0-9A-Fa-f]+$/.test(value);
      default: return false;
    }
  };

  const convert = () => {
    if (!validateInput(inputValue, inputSystem)) {
      setResults({ binary: t.nsInvalid, octal: t.nsInvalid, decimal: t.nsInvalid, hexadecimal: t.nsInvalid });
      return;
    }

    let decimalValue: number;
    switch (inputSystem) {
      case 'binary': decimalValue = parseInt(inputValue, 2); break;
      case 'octal': decimalValue = parseInt(inputValue, 8); break;
      case 'decimal': decimalValue = parseInt(inputValue, 10); break;
      case 'hexadecimal': decimalValue = parseInt(inputValue, 16); break;
      default: return;
    }

    if (isNaN(decimalValue) || decimalValue < 0) {
      setResults({ binary: t.nsError, octal: t.nsError, decimal: t.nsError, hexadecimal: t.nsError });
      return;
    }

    setResults({
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      decimal: decimalValue.toString(10),
      hexadecimal: decimalValue.toString(16).toUpperCase()
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">{t.nsTitle}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">{t.nsInputSystem}</label>
          <select
            value={inputSystem}
            onChange={(e) => setInputSystem(e.target.value as NumberSystem)}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="binary">{t.nsBinary}</option>
            <option value="octal">{t.nsOctal}</option>
            <option value="decimal">{t.nsDecimal}</option>
            <option value="hexadecimal">{t.nsHexadecimal}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">{t.nsInputValue}</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.nsPlaceholder}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            {inputSystem === 'binary' && t.nsHintBinary}
            {inputSystem === 'octal' && t.nsHintOctal}
            {inputSystem === 'decimal' && t.nsHintDecimal}
            {inputSystem === 'hexadecimal' && t.nsHintHex}
          </p>
        </div>

        <button
          onClick={convert}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {t.nsConvert}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="border-t border-slate-700 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">{t.nsResults}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">{t.nsBinary}</div>
            <div className="text-lg text-white font-mono break-all">{results.binary || '-'}</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">{t.nsOctal}</div>
            <div className="text-lg text-white font-mono break-all">{results.octal || '-'}</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">{t.nsDecimal}</div>
            <div className="text-lg text-white font-mono break-all">{results.decimal || '-'}</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm font-semibold text-blue-300 mb-2">{t.nsHexadecimal}</div>
            <div className="text-lg text-white font-mono break-all">{results.hexadecimal || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSystemConverter;
