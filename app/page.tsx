"use client";

import { useState, useEffect } from "react";

const fetchExchangeRates = async (baseCurrency: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!API_URL || !API_KEY) {
    console.error("Missing API_URL or API_KEY in environment variables.");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/${API_KEY}/latest/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.conversion_rates) {
      throw new Error("No exchange rates found");
    }

    console.log("Fetched Data:", data);
    return data.conversion_rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
};


export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      const rates = await fetchExchangeRates("USD");
      if (rates) {
        setCurrencies(Object.keys(rates));
      }
    };
    loadCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const rates = await fetchExchangeRates(fromCurrency);
    if (rates && rates[toCurrency]) {
      setConvertedAmount(Number((amount * rates[toCurrency]).toFixed(2)));
    } else {
      console.error("Invalid currency conversion.");
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(1); // Reset amount to 1
    setConvertedAmount(null); // Hide converted amount
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-white">
      <div className="p-6 max-w-md w-full bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Currency Converter</h2>

        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 1)}
            className="border border-gray-300 p-2 rounded w-full text-center"
            placeholder="Enter amount"
            min="1"
          />

          <div className="flex items-center space-x-4">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="border border-gray-300 p-2 rounded w-1/2"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>

            <button
              onClick={swapCurrencies}
              className="hover:bg-gray-400 text-black p-2 rounded-full transition"
              title="Swap Currencies"
            >
              🔄
            </button>

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="border border-gray-300 p-2 rounded w-1/2"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <button
            onClick={convertCurrency}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded w-full transition"
          >
            Convert
          </button>

          {convertedAmount !== null && (
            <p className="text-lg font-semibold text-gray-800">
              {amount} {fromCurrency} = <span className="text-blue-600">{convertedAmount} {toCurrency}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
