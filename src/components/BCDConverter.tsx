import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const BCDConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'decimal' | 'bcd'>('decimal');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');

  const decimalToBCD = (decimal: number): string => {
    if (decimal < 0 || decimal > 9) {
      return '';
    }
    return decimal.toString(2).padStart(4, '0');
  };

  const bcdToDecimal = (bcd: string): number => {
    const value = parseInt(bcd, 2);
    if (value >= 0 && value <= 9) {
      return value;
    }
    return -1;
  };

  const convert = () => {
    if (!inputValue) {
      setResult('');
      setExplanation('');
      return;
    }

    if (inputType === 'decimal') {
      if (!/^\d+$/.test(inputValue)) {
        setResult('Ungültige Eingabe');
        setExplanation('Bitte nur Dezimalziffern (0-9) eingeben.');
        return;
      }

      const digits = inputValue.split('');
      const bcdCodes = digits.map((digit) => {
        const num = parseInt(digit);
        return decimalToBCD(num);
      });

      if (bcdCodes.some((code) => code === '')) {
        setResult('Fehler');
        setExplanation('Ungültige Ziffer gefunden.');
        return;
      }

      setResult(bcdCodes.join(' '));
      setExplanation(
        `Jede Dezimalziffer wird einzeln in ihre 4-Bit-Binärdarstellung umgewandelt. BCD nutzt nur die Binärwerte 0000 bis 1001 (0-9).`
      );
    } else {
      const cleanInput = inputValue.replace(/\s+/g, '');

      if (!/^[01]+$/.test(cleanInput)) {
        setResult('Ungültige Eingabe');
        setExplanation('Bitte nur 0 und 1 eingeben.');
        return;
      }

      if (cleanInput.length % 4 !== 0) {
        setResult('Ungültige Eingabe');
        setExplanation('BCD-Code muss in 4-Bit-Blöcken vorliegen.');
        return;
      }

      const blocks = cleanInput.match(/.{4}/g) || [];
      const decimalDigits = blocks.map((block) => bcdToDecimal(block));

      if (decimalDigits.some((digit) => digit === -1)) {
        setResult('Ungültiger BCD-Code');
        setExplanation(
          'Einer oder mehrere 4-Bit-Blöcke entsprechen keinem gültigen BCD-Code (nur 0000-1001 erlaubt).'
        );
        return;
      }

      setResult(decimalDigits.join(''));
      setExplanation(
        `Jeder 4-Bit-BCD-Block wird in die entsprechende Dezimalziffer umgewandelt.`
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">BCD-Code Konverter</h2>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">Was ist BCD-Code?</h3>
        <p className="text-sm text-blue-200">
          Binary Coded Decimal (BCD) ist ein binäres Zahlensystem, bei dem jede Dezimalziffer
          einzeln als 4-Bit-Binärzahl dargestellt wird. Es werden nur die Werte 0000 (0) bis
          1001 (9) verwendet. Beispiel: 42 → 0100 0010
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            Konvertierungsrichtung
          </label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'decimal' | 'bcd')}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="decimal">Dezimal → BCD-Code</option>
            <option value="bcd">BCD-Code → Dezimal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            {inputType === 'decimal' ? 'Dezimalzahl' : 'BCD-Code (Binär)'}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputType === 'decimal' ? 'z.B. 9876' : 'z.B. 1001 1000 0111 0110'}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">
            {inputType === 'decimal'
              ? 'Geben Sie eine Dezimalzahl ein (z.B. 9876)'
              : 'Geben Sie BCD-Code als 4-Bit-Blöcke ein (z.B. 10011000)'}
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

      {result && (
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Ergebnis</h3>
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="text-3xl text-white font-mono break-all mb-4">
              {result}
            </div>
            {explanation && (
              <div className="text-sm text-blue-300 border-t border-slate-600 pt-4">
                {explanation}
              </div>
            )}
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-3">BCD-Code Tabelle</h4>
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
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Hinweis</h4>
            <p className="text-sm text-blue-200">
              Die Binärkombinationen 1010 bis 1111 sind im BCD-Code ungültig und werden nicht
              verwendet, da sie nicht den Dezimalziffern 0-9 entsprechen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BCDConverter;
