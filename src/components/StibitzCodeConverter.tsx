import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const StibitzCodeConverter = () => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'decimal' | 'stibitz'>('decimal');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');

  const decimalToStibitz = (decimal: number): string => {
    if (decimal < 0 || decimal > 9) return '';
    const stibitzMap: { [key: number]: string } = {
      0: '0011', 1: '0100', 2: '0101', 3: '0110', 4: '0111',
      5: '1000', 6: '1001', 7: '1010', 8: '1011', 9: '1100'
    };
    return stibitzMap[decimal];
  };

  const stibitzToDecimal = (stibitz: string): number => {
    const stibitzMap: { [key: string]: number } = {
      '0011': 0, '0100': 1, '0101': 2, '0110': 3, '0111': 4,
      '1000': 5, '1001': 6, '1010': 7, '1011': 8, '1100': 9
    };
    return stibitzMap[stibitz] ?? -1;
  };

  const convert = () => {
    if (!inputValue) { setResult(''); setExplanation(''); return; }

    if (inputType === 'decimal') {
      if (!/^\d+$/.test(inputValue)) {
        setResult(t.stInvalid); setExplanation(t.stErrorOnlyDigits); return;
      }
      const digits = inputValue.split('');
      const stibitzCodes = digits.map((digit) => decimalToStibitz(parseInt(digit)));
      if (stibitzCodes.some((code) => code === '')) {
        setResult(t.stError); setExplanation(t.stErrorInvalidDigit); return;
      }
      setResult(stibitzCodes.join(' '));
      setExplanation(t.stExplainDecToStibitz);
    } else {
      const cleanInput = inputValue.replace(/\s+/g, '');
      if (!/^[01]+$/.test(cleanInput)) {
        setResult(t.stInvalid); setExplanation(t.stErrorOnlyBits); return;
      }
      if (cleanInput.length % 4 !== 0) {
        setResult(t.stInvalid); setExplanation(t.stErrorBlocks); return;
      }
      const blocks = cleanInput.match(/.{4}/g) || [];
      const decimalDigits = blocks.map((block) => stibitzToDecimal(block));
      if (decimalDigits.some((digit) => digit === -1)) {
        setResult(t.stErrorInvalidCode); setExplanation(t.stErrorInvalidBlocks); return;
      }
      setResult(decimalDigits.join(''));
      setExplanation(t.stExplainStibitzToDec);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">{t.stTitle}</h2>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">{t.stInfoTitle}</h3>
        <p className="text-sm text-blue-200">{t.stInfoText}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">{t.stDirection}</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'decimal' | 'stibitz')}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="decimal">{t.stDecToStibitz}</option>
            <option value="stibitz">{t.stStibitzToDec}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            {inputType === 'decimal' ? t.stLabelDecimal : t.stLabelStibitz}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputType === 'decimal' ? t.stPlaceholderDec : t.stPlaceholderStibitz}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">
            {inputType === 'decimal' ? t.stHintDec : t.stHintStibitz}
          </p>
        </div>

        <button
          onClick={convert}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {t.stConvert}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {result && (
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">{t.stResult}</h3>
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="text-3xl text-white font-mono break-all mb-4">{result}</div>
            {explanation && (
              <div className="text-sm text-blue-300 border-t border-slate-600 pt-4">{explanation}</div>
            )}
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-3">{t.stTableTitle}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="bg-slate-600 p-2 rounded text-center">
                  <div className="text-blue-300 font-semibold">{num}</div>
                  <div className="text-white font-mono text-xs">{decimalToStibitz(num)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StibitzCodeConverter;
