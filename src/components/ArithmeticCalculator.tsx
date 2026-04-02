import { useState } from 'react';
import { Plus, Minus, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type NumberSystem = 'binary' | 'octal' | 'decimal' | 'hexadecimal';
type Operation = 'add' | 'subtract' | 'multiply';

const ArithmeticCalculator = () => {
  const { t } = useLanguage();
  const [numberSystem, setNumberSystem] = useState<NumberSystem>('decimal');
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

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

  const toDecimal = (value: string, system: NumberSystem): number => {
    switch (system) {
      case 'binary': return parseInt(value, 2);
      case 'octal': return parseInt(value, 8);
      case 'decimal': return parseInt(value, 10);
      case 'hexadecimal': return parseInt(value, 16);
      default: return 0;
    }
  };

  const fromDecimal = (value: number, system: NumberSystem): string => {
    switch (system) {
      case 'binary': return value.toString(2);
      case 'octal': return value.toString(8);
      case 'decimal': return value.toString(10);
      case 'hexadecimal': return value.toString(16).toUpperCase();
      default: return '';
    }
  };

  const getSystemLabel = (system: NumberSystem): string => {
    const labels: Record<NumberSystem, string> = {
      binary: t.nsBinary,
      octal: t.nsOctal,
      decimal: t.nsDecimal,
      hexadecimal: t.nsHexadecimal,
    };
    return labels[system];
  };

  const getPlaceholder = (system: NumberSystem): string => {
    const placeholders: Record<NumberSystem, string> = {
      binary: 'e.g. 1010',
      octal: 'e.g. 12',
      decimal: 'e.g. 10',
      hexadecimal: 'e.g. A',
    };
    return placeholders[system];
  };

  const calculate = () => {
    if (!validateInput(firstNumber, numberSystem) || !validateInput(secondNumber, numberSystem)) {
      setError(t.arInvalid);
      setResult('');
      return;
    }

    const num1 = toDecimal(firstNumber, numberSystem);
    const num2 = toDecimal(secondNumber, numberSystem);
    let decimalResult: number;

    try {
      switch (operation) {
        case 'add': decimalResult = num1 + num2; break;
        case 'subtract':
          decimalResult = num1 - num2;
          if (decimalResult < 0) { setError(t.arNegativeError); setResult(''); return; }
          break;
        case 'multiply': decimalResult = num1 * num2; break;
        default: return;
      }
      setResult(fromDecimal(decimalResult, numberSystem));
      setError('');
    } catch {
      setError(t.arCalcError);
      setResult('');
    }
  };

  const getRadix = (system: NumberSystem) =>
    system === 'hexadecimal' ? 16 : system === 'octal' ? 8 : system === 'binary' ? 2 : 10;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">{t.arTitle}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">{t.arSystem}</label>
          <select
            value={numberSystem}
            onChange={(e) => { setNumberSystem(e.target.value as NumberSystem); setResult(''); setError(''); }}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="binary">{t.nsBinary}</option>
            <option value="octal">{t.nsOctal}</option>
            <option value="decimal">{t.nsDecimal}</option>
            <option value="hexadecimal">{t.nsHexadecimal}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-300 mb-2">{t.arFirstNumber}</label>
            <input
              type="text"
              value={firstNumber}
              onChange={(e) => setFirstNumber(e.target.value.toUpperCase())}
              placeholder={getPlaceholder(numberSystem)}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-300 mb-2">{t.arOperation}</label>
            <select
              value={operation}
              onChange={(e) => { setOperation(e.target.value as Operation); setResult(''); setError(''); }}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">+ Addition</option>
              <option value="subtract">&#8722; Subtraktion</option>
              <option value="multiply">&#215; Multiplikation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-300 mb-2">{t.arSecondNumber}</label>
            <input
              type="text"
              value={secondNumber}
              onChange={(e) => setSecondNumber(e.target.value.toUpperCase())}
              placeholder={getPlaceholder(numberSystem)}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {t.arCalculate}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-sm font-semibold">{error}</p>
          <p className="text-red-200 text-xs mt-1">
            {numberSystem === 'binary' && t.nsHintBinary}
            {numberSystem === 'octal' && t.nsHintOctal}
            {numberSystem === 'decimal' && t.nsHintDecimal}
            {numberSystem === 'hexadecimal' && t.nsHintHex}
          </p>
        </div>
      )}

      {result && !error && (
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">{t.arResult}</h3>
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="flex-1">
                <p className="text-sm text-blue-300 mb-1">{t.arFirstLabel} ({getSystemLabel(numberSystem)})</p>
                <p className="text-xl font-mono text-white">{firstNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                {operation === 'add' && <Plus className="w-6 h-6 text-blue-400" />}
                {operation === 'subtract' && <Minus className="w-6 h-6 text-blue-400" />}
                {operation === 'multiply' && <X className="w-6 h-6 text-blue-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-300 mb-1">{t.arSecondLabel} ({getSystemLabel(numberSystem)})</p>
                <p className="text-xl font-mono text-white">{secondNumber}</p>
              </div>
            </div>
            <div className="border-t border-slate-600 pt-4">
              <p className="text-sm text-blue-300 mb-2">{t.arResultLabel} ({getSystemLabel(numberSystem)})</p>
              <p className="text-3xl font-mono text-green-400 font-bold">{result}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">{t.nsBinary}</p>
              <p className="text-sm font-mono text-white break-all">
                {parseInt(result, getRadix(numberSystem)).toString(2)}
              </p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">{t.nsOctal}</p>
              <p className="text-sm font-mono text-white break-all">
                {parseInt(result, getRadix(numberSystem)).toString(8)}
              </p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">{t.nsDecimal}</p>
              <p className="text-sm font-mono text-white break-all">
                {parseInt(result, getRadix(numberSystem)).toString(10)}
              </p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">{t.nsHexadecimal}</p>
              <p className="text-sm font-mono text-white break-all">
                {parseInt(result, getRadix(numberSystem)).toString(16).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArithmeticCalculator;
