// src/components/CurrencyConverter.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [conversionData, setConversionData] = useState({
    amount: '',
    fromCurrency: 'INR',
    toCurrency: 'USD'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await api.get('/finance/currencies');
      if (response.data.success) {
        setCurrencies(response.data.currencies);
      }
    } catch (err) {
      console.error('Error loading currencies:', err);
      setError('Failed to load currencies');
    }
  };

  const handleConvert = async () => {
    if (!conversionData.amount || conversionData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (conversionData.fromCurrency === conversionData.toCurrency) {
      setError('Please select different currencies');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/finance/convert', conversionData);
      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.response?.data?.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setConversionData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
    setResult(null);
  };

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Currency Converter</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Converter Form */}
      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={conversionData.amount}
              onChange={(e) => setConversionData({...conversionData, amount: e.target.value})}
              placeholder="Enter amount"
              className="w-full pl-3 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">
                {getCurrencySymbol(conversionData.fromCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={conversionData.fromCurrency}
              onChange={(e) => setConversionData({...conversionData, fromCurrency: e.target.value})}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSwapCurrencies}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors duration-200"
              title="Swap currencies"
            >
              <svg className="w-5 h-5 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={conversionData.toCurrency}
              onChange={(e) => setConversionData({...conversionData, toCurrency: e.target.value})}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : (
            'Convert Currency'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900 mb-2">
                {getCurrencySymbol(result.toCurrency)} {result.convertedAmount.toLocaleString()}
              </div>
              <p className="text-green-700 text-sm">
                {getCurrencySymbol(result.fromCurrency)} {result.originalAmount.toLocaleString()} {result.fromCurrency} = {getCurrencySymbol(result.toCurrency)} {result.convertedAmount.toLocaleString()} {result.toCurrency}
              </p>
              <p className="text-green-600 text-xs mt-1">
                Exchange Rate: 1 {result.fromCurrency} = {result.exchangeRate} {result.toCurrency}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Last updated: {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Convert Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Convert</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setConversionData({...conversionData, toCurrency: 'USD'})}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors duration-200"
          >
            INR → USD
          </button>
          <button
            onClick={() => setConversionData({...conversionData, toCurrency: 'EUR'})}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors duration-200"
          >
            INR → EUR
          </button>
          <button
            onClick={() => setConversionData({...conversionData, toCurrency: 'AED'})}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors duration-200"
          >
            INR → AED
          </button>
          <button
            onClick={() => setConversionData({...conversionData, toCurrency: 'GBP'})}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors duration-200"
          >
            INR → GBP
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;