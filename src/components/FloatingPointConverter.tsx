import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type FloatingPointFormat = 'ieee32' | 'ieee64';

interface FloatingPointInfo {
  sign: string;
  exponent: string;
  mantissa: string;
  normalized: string;
  decimal: string;
}

const FloatingPointConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversionType, setConversionType] = useState<'decimal-to-binary' | 'binary-to-decimal'>('decimal-to-binary');
  const [format, setFormat] = useState<FloatingPointFormat>('ieee32');
  const [result, setResult] = useState<FloatingPointInfo | null>(null);
  const [error, setError] = useState('');

  const decimalToBinary32 = (decimal: number): FloatingPointInfo => {
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, decimal);
    const bits = view.getUint32(0);
    const binary = bits.toString(2).padStart(32, '0');

    const sign = binary[0];
    const exponent = binary.slice(1, 9);
    const mantissa = binary.slice(9);

    const exponentValue = parseInt(exponent, 2) - 127;
    const mantissaBits = '1' + mantissa;
    let normalized = '';

    if (exponentValue >= 0) {
      const shiftAmount = exponentValue + 1;
      if (shiftAmount >= mantissaBits.length) {
        normalized = mantissaBits + '0'.repeat(shiftAmount - mantissaBits.length);
      } else {
        normalized = mantissaBits.slice(0, shiftAmount) + '.' + mantissaBits.slice(shiftAmount);
      }
    } else {
      normalized = '0.' + '0'.repeat(-exponentValue - 1) + mantissaBits;
    }

    return {
      sign: sign === '0' ? '+' : '−',
      exponent,
      mantissa,
      normalized,
      decimal: decimal.toString()
    };
  };

  const decimalToBinary64 = (decimal: number): FloatingPointInfo => {
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, decimal);
    const bits = view.getBigUint64(0);
    const binary = bits.toString(2).padStart(64, '0');

    const sign = binary[0];
    const exponent = binary.slice(1, 12);
    const mantissa = binary.slice(12);

    const exponentValue = parseInt(exponent, 2) - 1023;
    const mantissaBits = '1' + mantissa;
    let normalized = '';

    if (exponentValue >= 0) {
      const shiftAmount = exponentValue + 1;
      if (shiftAmount >= mantissaBits.length) {
        normalized = mantissaBits + '0'.repeat(shiftAmount - mantissaBits.length);
      } else {
        normalized = mantissaBits.slice(0, shiftAmount) + '.' + mantissaBits.slice(shiftAmount);
      }
    } else {
      normalized = '0.' + '0'.repeat(-exponentValue - 1) + mantissaBits;
    }

    return {
      sign: sign === '0' ? '+' : '−',
      exponent,
      mantissa,
      normalized,
      decimal: decimal.toString()
    };
  };

  const binary32ToDecimal = (binary: string): FloatingPointInfo => {
    const cleanBinary = binary.replace(/\s/g, '');
    if (cleanBinary.length !== 32) {
      throw new Error('IEEE 32-bit format requires exactly 32 bits');
    }

    const bits = parseInt(cleanBinary, 2);
    const view = new DataView(new ArrayBuffer(4));
    view.setUint32(0, bits);
    const decimal = view.getFloat32(0);

    const sign = cleanBinary[0];
    const exponent = cleanBinary.slice(1, 9);
    const mantissa = cleanBinary.slice(9);

    const exponentValue = parseInt(exponent, 2) - 127;
    const mantissaBits = '1' + mantissa;
    let normalized = '';

    if (exponentValue >= 0) {
      const shiftAmount = exponentValue + 1;
      if (shiftAmount >= mantissaBits.length) {
        normalized = mantissaBits + '0'.repeat(shiftAmount - mantissaBits.length);
      } else {
        normalized = mantissaBits.slice(0, shiftAmount) + '.' + mantissaBits.slice(shiftAmount);
      }
    } else {
      normalized = '0.' + '0'.repeat(-exponentValue - 1) + mantissaBits;
    }

    return {
      sign: sign === '0' ? '+' : '−',
      exponent,
      mantissa,
      normalized,
      decimal: decimal.toString()
    };
  };

  const binary64ToDecimal = (binary: string): FloatingPointInfo => {
    const cleanBinary = binary.replace(/\s/g, '');
    if (cleanBinary.length !== 64) {
      throw new Error('IEEE 64-bit format requires exactly 64 bits');
    }

    const bits = BigInt('0b' + cleanBinary);
    const view = new DataView(new ArrayBuffer(8));
    view.setBigUint64(0, bits);
    const decimal = view.getFloat64(0);

    const sign = cleanBinary[0];
    const exponent = cleanBinary.slice(1, 12);
    const mantissa = cleanBinary.slice(12);

    const exponentValue = parseInt(exponent, 2) - 1023;
    const mantissaBits = '1' + mantissa;
    let normalized = '';

    if (exponentValue >= 0) {
      const shiftAmount = exponentValue + 1;
      if (shiftAmount >= mantissaBits.length) {
        normalized = mantissaBits + '0'.repeat(shiftAmount - mantissaBits.length);
      } else {
        normalized = mantissaBits.slice(0, shiftAmount) + '.' + mantissaBits.slice(shiftAmount);
      }
    } else {
      normalized = '0.' + '0'.repeat(-exponentValue - 1) + mantissaBits;
    }

    return {
      sign: sign === '0' ? '+' : '−',
      exponent,
      mantissa,
      normalized,
      decimal: decimal.toString()
    };
  };

  const convert = () => {
    try {
      setError('');

      if (conversionType === 'decimal-to-binary') {
        if (!inputValue || isNaN(parseFloat(inputValue))) {
          setError('Bitte geben Sie eine gültige Dezimalzahl ein');
          setResult(null);
          return;
        }

        const decimal = parseFloat(inputValue);
        if (format === 'ieee32') {
          setResult(decimalToBinary32(decimal));
        } else {
          setResult(decimalToBinary64(decimal));
        }
      } else {
        if (!inputValue || !/^[01\s]+$/.test(inputValue)) {
          setError('Bitte geben Sie nur 0 und 1 ein');
          setResult(null);
          return;
        }

        if (format === 'ieee32') {
          setResult(binary32ToDecimal(inputValue));
        } else {
          setResult(binary64ToDecimal(inputValue));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konvertierungsfehler');
      setResult(null);
    }
  };

  const getFormatInfo = (): { sign: number; exponent: number; mantissa: number; total: number } => {
    if (format === 'ieee32') {
      return { sign: 1, exponent: 8, mantissa: 23, total: 32 };
    } else {
      return { sign: 1, exponent: 11, mantissa: 52, total: 64 };
    }
  };

  const info = getFormatInfo();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Fließkomma-Konverter (IEEE 754)</h2>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">IEEE 754 Standard</h3>
        <p className="text-sm text-blue-200">
          IEEE 754 ist der Standard für Fließkommazahlendarstellung. Das Format besteht aus:
          Vorzeichen (1 Bit), Exponent ({info.exponent} Bit), Mantisse ({info.mantissa} Bit).
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-300 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => {
                setFormat(e.target.value as FloatingPointFormat);
                setResult(null);
                setError('');
              }}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ieee32">IEEE 32-bit (Float)</option>
              <option value="ieee64">IEEE 64-bit (Double)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-300 mb-2">
              Konvertierungsrichtung
            </label>
            <select
              value={conversionType}
              onChange={(e) => {
                setConversionType(e.target.value as 'decimal-to-binary' | 'binary-to-decimal');
                setResult(null);
                setError('');
              }}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="decimal-to-binary">Dezimal → Binär</option>
              <option value="binary-to-decimal">Binär → Dezimal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            {conversionType === 'decimal-to-binary' ? 'Dezimalzahl' : 'IEEE 754 Binärzahl'}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              conversionType === 'decimal-to-binary'
                ? 'z.B. 3.14 oder -42.5'
                : format === 'ieee32'
                  ? 'z.B. 01000000010010001111010111000011'
                  : 'z.B. 0100000000001001000111101011100011010101110000101000101010101010'
            }
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">
            {conversionType === 'decimal-to-binary'
              ? 'Geben Sie eine Dezimalzahl ein'
              : format === 'ieee32'
                ? 'Geben Sie 32 Bits ein (0 und 1)'
                : 'Geben Sie 64 Bits ein (0 und 1)'}
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

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-sm font-semibold">{error}</p>
        </div>
      )}

      {result && (
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">IEEE 754 Analyse</h3>

          <div className="bg-slate-700 p-6 rounded-lg space-y-4">
            <div>
              <p className="text-sm text-blue-300 mb-2">Dezimalwert</p>
              <p className="text-2xl font-mono text-white font-bold">{result.decimal}</p>
            </div>

            <div className="border-t border-slate-600 pt-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Vorzeichen (1 Bit)
                  </span>
                  <p className="text-blue-300 text-sm">
                    {result.sign} (0 = positiv, 1 = negativ)
                  </p>
                </div>
                <p className="text-white font-mono text-lg bg-red-900/20 p-2 rounded border border-red-600/50">
                  {result.sign === '+' ? '0' : '1'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Exponent ({info.exponent} Bits)
                  </span>
                  <p className="text-blue-300 text-sm">
                    Wert: {parseInt(result.exponent, 2)} ({format === 'ieee32' ? 'Bias 127' : 'Bias 1023'})
                  </p>
                </div>
                <p className="text-white font-mono text-sm bg-green-900/20 p-2 rounded border border-green-600/50 break-all">
                  {result.exponent}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Mantisse ({info.mantissa} Bits)
                  </span>
                  <p className="text-blue-300 text-sm">Signifikante Ziffern</p>
                </div>
                <p className="text-white font-mono text-sm bg-blue-900/20 p-2 rounded border border-blue-600/50 break-all">
                  {result.mantissa}
                </p>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <p className="text-sm text-blue-300 mb-2">Normalisierte Form</p>
                <p className="text-white font-mono text-sm bg-slate-600/50 p-2 rounded break-all">
                  {result.normalized}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Format-Information</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-blue-300">Vorzeichen</p>
                <p className="text-white font-bold">{info.sign} Bit</p>
              </div>
              <div>
                <p className="text-blue-300">Exponent</p>
                <p className="text-white font-bold">{info.exponent} Bits</p>
              </div>
              <div>
                <p className="text-blue-300">Mantisse</p>
                <p className="text-white font-bold">{info.mantissa} Bits</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingPointConverter;
