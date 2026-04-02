import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const BCDConverter = () => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'decimal' | 'bcd'>('decimal');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');

  const decimalToBCD = (decimal: number): string => {
    if (decimal < 0 || decimal > 9) return '';
    return decimal.toString(2).padStart(4, '0');
  };

  const bcdToDecimal = (bcd: string): number => {
    const value = parseInt(bcd, 2);
    return (value >= 0 && value <= 9) ? value : -1;
  };

  const convert = () => {
    if (!inputValue) { setResult(''); setExplanation(''); return; }

    if (inputType === 'decimal') {
      if (!/^\d+$/.test(inputValue)) {
        setResult(t.bcdInvalid); setExplanation(t.bcdErrorOnlyDigits); return;
      }
      const digits = inputValue.split('');
      const bcdCodes = digits.map((digit) => decimalToBCD(parseInt(digit)));
      if (bcdCodes.some((code) => code === '')) {
        setResult(t.bcdError); setExplanation(t.bcdErrorInvalidDigit); return;
      }
      setResult(bcdCodes.join(' '));
      setExplanation(t.bcdExplainDecToBcd);
    } else {
      const cleanInput = inputValue.replace(/\s+/g, '');
      if (!/^[01]+$/.test(cleanInput)) {
        setResult(t.bcdInvalid); setExplanation(t.bcdErrorOnlyBits); return;
      }
      if (cleanInput.length % 4 !== 0) {
        setResult(t.bcdInvalid); setExplanation(t.bcdErrorBlocks); return;
      }
      const blocks = cleanInput.match(/.{4}/g) || [];
      const decimalDigits = blocks.map((block) => bcdToDecimal(block));
      if (decimalDigits.some((digit) => digit === -1)) {
        setResult(t.bcdErrorInvalidCode); setExplanation(t.bcdErrorInvalidBlocks); return;
      }
      setResult(decimalDigits.join(''));
      setExplanation(t.bcdExplainBcdToDec);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">{t.bcdTitle}</h2>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">{t.bcdInfoTitle}</h3>
        <p className="text-sm text-blue-200">{t.bcdInfoText}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">{t.bcdDirection}</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'decimal' | 'bcd')}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="decimal">{t.bcdDecToBcd}</option>
            <option value="bcd">{t.bcdBcdToDec}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            {inputType === 'decimal' ? t.bcdLabelDecimal : t.bcdLabelBcd}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputType === 'decimal' ? t.bcdPlaceholderDec : t.bcdPlaceholderBcd}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">
            {inputType === 'decimal' ? t.bcdHintDec : t.bcdHintBcd}
          </p>
        </div>

        <button
          onClick={convert}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {t.bcdConvert}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {result && (
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">{t.bcdResult}</h3>
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="text-3xl text-white font-mono break-all mb-4">{result}</div>
            {explanation && (
              <div className="text-sm text-blue-300 border-t border-slate-600 pt-4">{explanation}</div>
            )}
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-3">{t.bcdTableTitle}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="bg-slate-600 p-2 rounded text-center">
                  <div className="text-blue-300 font-semibold">{num}</div>
                  <div className="text-white font-mono text-xs">{decimalToBCD(num)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">{t.bcdNoteTitle}</h4>
            <p className="text-sm text-blue-200">{t.bcdNoteText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BCDConverter;
