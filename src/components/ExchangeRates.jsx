// src/components/ExchangeRates.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const ExchangeRates = () => {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExchangeRates();
  }, [baseCurrency]);

  const loadExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/finance/rates?base=${baseCurrency}`);
      if (response.data.success) {
        setRates(response.data.rates);
      }
    } catch (err) {
      console.error('Error loading exchange rates:', err);
    } finally {
      setLoading(false);
    }
  };

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'JPY', 'SGD'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Exchange Rates</h3>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="AED">AED</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {popularCurrencies.map(currency => (
            rates[currency] && (
              <div key={currency} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-700">
                  1 {baseCurrency}
                </span>
                <span className="text-sm text-gray-900">
                  = {rates[currency].toFixed(4)} {currency}
                </span>
              </div>
            )
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Rates update automatically
        </p>
      </div>
    </div>
  );
};

export default ExchangeRates;